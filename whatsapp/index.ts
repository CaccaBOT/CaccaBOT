import { Message, Client, LocalAuth } from 'whatsapp-web.js'
import { Command } from '../types/Command'
//@ts-ignore
import QRCode from 'qrcode-terminal'
import {
  addPoop,
  getUserProfileByPhone,
  createUser,
  getLastPoop,
  poopStatsFromUserWithFilter
} from '../database/index'
import poopValidator from '../validators/poop'
import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'
import { MessageInfo } from '../types/MessageInfo'
import achievementChecker from '../achievements/check'
import { config } from '../config/loader'
import log from 'loglevel'
export let commands: Command[] = []

export const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    handleSIGINT: false,
    timeout: 60000,
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  }
})

whatsappClient.on('qr', (qr) => QRCode.generate(qr, { small: true }))

whatsappClient.on('ready', async () => {
  const commandsDir = fs
    .readdirSync(`${path.resolve('./commands')}`)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
  for (const cmdFile of commandsDir) {
    const cmd = await import(`${path.resolve('./commands')}/${cmdFile}`)
    commands.push(cmd.default)
    log.info(`[COMMAND] ${cmd.default.name}`)
  }

  log.info('[WHATSAPP] Ready on ' + whatsappClient.info.wid.user)

  /*
	 fetch the last 100 messages to avoid errors
	 on messages where the application was not active
	*/
  await (await whatsappClient.getChatById(config.groupId)).fetchMessages({
    limit: 100
  })
})

whatsappClient.on('message_create', async (message: Message) => {
  try {
    const parsedMessage = await parseMessage(message)
    let id = parsedMessage?.sender

    if (!poopValidator.validate(parsedMessage?.content) || id == null) {
      return
    }

    let foundUser = getUserProfileByPhone(id)

    if (!foundUser.id) {
      const contact = await message.getContact()
      const username = contact.pushname
      const bio = await contact.getAbout()
      createUser(id, username, bio)
      foundUser = getUserProfileByPhone(id)
    }
    addPoop(foundUser.id)
    const stats = poopStatsFromUserWithFilter(
      foundUser.id,
      moment().year(),
      moment().month() + 1
    )
    const poop = getLastPoop()
    message.reply(
      '✅ Saved' +
        '\nID: ' +
        poop.id +
        '\nTimestamp: ' +
        poop.timestamp +
        '\nRank: ' +
        stats.monthlyLeaderboardPosition +
        '°' +
        '\nStreak: ' +
        stats.streak +
        '\nDaily AVG: ' +
        stats.poopAverage +
        '\nMonthly: ' +
        stats.monthlyPoops +
        '\nCertificate: ' +
        `${config.serverUrl}/poop/${poop.id}`
    )
    achievementChecker.checkPoopBased(foundUser, poop, message)
  } catch (e) {
    log.error(e)
  }
})

async function parseMessage(
  message: Message
): Promise<MessageInfo | undefined> {
  if (Object.values(message.body).length == 0 || message.body == null) {
    return
  }

  let info = {
    isInGroup: false,
    isCommand: false,
    isSelf: false,
    content: '',
    sender: '' as string | undefined,
    group: '',
    command: {
      name: '',
      args: [] as string[],
      flags: []
    }
  }

  if (message.body.toLowerCase().startsWith(`${config.prefix} `)) {
    info.isCommand = true
    let msgContent = message.body.split(' ')
    info.command.name = msgContent[1]
    for (let i = 2; i < msgContent.length; i++) {
      info.command.args.push(msgContent[i])
    }
  }

  if (message.fromMe) info.isSelf = true

  info.sender = message.from
  info.content = message.body

  let chat = await message.getChat()

  if (!config.groupId && info.isCommand) {
    message.reply(
      'Group ID: ' +
        chat.id._serialized +
        '\n' +
        'Please paste this string in your configuration file ' +
        'on the field groupId before using CaccaBOT'
    )
    return
  }

  if (chat.id._serialized != config.groupId) {
    return
  }

  if (chat.isGroup) {
    info.isInGroup = true
    info.group = chat.name
    info.sender = message.author
  }

  if (config.logMessages) {
    log.info(info)
  }

  if (info.isCommand) {
    try {
      const command = commands.find((cmd) => cmd.name === info.command.name)

      if (command) {
        command.execute(message, info.command)
      }
    } catch (error) {
      message.reply(`❌ An error has occurred while loading the commands`)
    }
  }
  return info
}

process.on('SIGINT', async () => {
  log.error('\n[SYSTEM] Terminating process due to SIGINT signal')
  await whatsappClient.destroy()
  process.exit(0)
})
