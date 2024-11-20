import { GroupChat, Message, Client, LocalAuth } from "whatsapp-web.js"
import { Command } from "../types/Command"
//@ts-ignore
import QRCode from 'qrcode-terminal'
//@ts-ignore
import schedule from 'node-schedule'
import { addPoop, getUserProfileByPhone, poopStreak, createUser, getLastPoop, deleteUser, getInactiveUsers } from '../database/index'
import { detectPoop } from '../poop/parser'
import config from '../config.json'
import fs from 'fs'
import path from 'path'
import replies from '../storage/replies.json'
import moment from 'moment-timezone'
import { RawUser } from "../types/User"
import { MessageInfo } from "../types/MessageInfo"
import achievementChecker from "../achievements/check"
export let commands: Command[] = []

export const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		handleSIGINT: false,
		timeout: 60000,
		args: [
			'--no-sandbox',
		]
	},
})

client.on('qr', (qr) => QRCode.generate(qr, { small: true }))

client.on('ready', async () => {
	const commandsDir = fs.readdirSync(`${path.resolve('./commands')}`)
		.filter((file) => file.endsWith('.ts'))
	for (const cmdFile of commandsDir) {
		const cmd = await import(`${path.resolve('./commands')}/${cmdFile}`)
		commands.push(cmd.default)
		console.info(`[COMMAND] ${cmd.default.name}`)
	}
	console.log('[WHATSAPP] Ready on ' + client.info.wid.user)

	if (config.monthlyPurge) {
		console.warn(
			'[WARNING] Monthly Purge is enabled, users who have been ' +
				'inactive for more than a month will be deleted at month reset!',
		)
		schedule.scheduleJob('0 0 1 * *', async () => {
			console.info(
				'[PURGE] Running Monthly Purge for ' + moment().subtract(1, 'month').format('MMMM YYYY'),
			)
			let purgeMsg = '*Running Monthly Purge*\n'
			const chat = await client.getChatById(config.groupId)
			if (chat.isGroup) {
				const inactiveUsers = getInactiveUsers(
					moment().subtract(1, 'month').toDate()
				)
				purgeMsg += inactiveUsers.map((u: RawUser) => u.username).join('\n')
				for (const user of inactiveUsers) {
					deleteUser(user.id)
					if (inactiveUsers.map((u: RawUser) => u.phone).includes(user.id.user)) {
						await (chat as GroupChat).removeParticipants([user.id._serialized])
					}
				}
			}

			chat.sendMessage(purgeMsg)
		})
	}
})

client.on('message_create', async (message: Message) => {
	const parsedMessage = await parseMessage(message)
	const id = detectPoop(parsedMessage)

	if (id != null) {
		let foundUser = getUserProfileByPhone(id)

		if (!foundUser.id) {
			const contact = await message.getContact()
			const username = contact.pushname
			const bio = await contact.getAbout()
			createUser(id, username, bio)
			foundUser = getUserProfileByPhone(id)
		}
		addPoop(foundUser.id)
		const streak = poopStreak(foundUser.id)
		message.reply(
			replies[Math.floor(Math.random() * replies.length)].replace(
				'{streak}',
				streak.toString(),
			),
		)
		const poop = getLastPoop()
		achievementChecker.checkPoopBased(foundUser, poop, message)
	}
})

async function parseMessage(message: Message): Promise<MessageInfo | undefined> {
	if (Object.values(message.body).length == 0 || message.body == null) {
		return;
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
			flags: [],
		},
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
				'Please paste this string in your config.json ' +
				'on the field groupId before using CaccaBOT',
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

	console.log(info)

	if (info.isCommand) {
		try {
			const command = commands.find((cmd) => cmd.name === info.command.name);

			if (command) {
				command.execute(message, info.command)
			}
		} catch (error) {
			message.reply(`❌ An error has occurred while loading the commands`);
		}
	}
	return info
}

process.on('SIGINT', async () => {
	console.log('\n[SIGINT] Terminating process')
	await client.destroy()
	process.exit(0)
})