const { Client, LocalAuth } = require('whatsapp-web.js')
const QRCode = require('qrcode-terminal')
const {
	initDatabase,
	addPoop,
	getUserProfileByPhone,
	poopStreak,
	createUser,
} = require('../database/index')
const { detectPoop } = require('../poop/parser')
const config = require('../config.json')
const fs = require('fs')
const path = require('path')
const replies = require('../storage/replies.json')
let commands = []

const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: { handleSIGINT: false },
	webVersionCache: {
		type: 'remote',
		remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html`,
	},
})

client.on('qr', (qr) => QRCode.generate(qr, { small: true }))

client.on('ready', () => {
	fs.readdirSync(`${path.resolve('./commands')}`)
		.filter((file) => file.endsWith('.js'))
		.forEach((file) => {
			let cmd = require(`${path.resolve('./commands')}/${file}`)
			commands.push(cmd)
			console.info(`${file} was loaded`)
		})
	initDatabase()
	console.log('Successfully logged in!')
})

client.on('message_create', async (message) => {
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
				streak,
			),
		)
	}
})

async function parseMessage(message) {
	if (Object.values(message.body).length == 0 || message.body == null) {
		return
	}

	let info = {
		isInGroup: false,
		isCommand: false,
		isSelf: false,
		content: '',
		sender: '',
		group: '',
		command: {
			name: '',
			args: [],
			flags: [],
		},
	}

	if (message.body.toLowerCase().startsWith(`${config.prefix} `)) {
		info.isCommand = true

		// analyze message by splitting it into an array with " " as separator
		let arrayMsgContent = message.body.split(' ')
		// set name of the command
		info.command.name = arrayMsgContent[1]

		// set the arguments of the command
		for (let i = 2; i < arrayMsgContent.length; i++) {
			info.command.args.push(arrayMsgContent[i])
		}
	}

	if (message.fromMe) info.isSelf = true

	info.sender = message.from
	info.content = message.body

	let chat = await message.getChat()

	if (chat.isGroup) {
		info.isInGroup = true
		info.group = chat.name
		info.sender = message.author
	}

	console.log(info)

	if (info.isCommand) {
		try {
			commands
				.find((cmd) => cmd.name == info.command.name)
				.execute(message, info.command)
		} catch (error) {
			message.reply(error)
		}
	}

	return info
}

process.on('SIGINT', async () => {
	console.log('\n[SIGINT] Quitting...')
	await client.destroy()
	process.exit(0)
})

module.exports = { client, commands }
