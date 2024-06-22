const { commands } = require('../whatsapp/index')
const config = require('../config.json')
module.exports = {
	name: 'help',
	description: 'display a help message',
	execute: (message, info) => {
		let helpString = ''
		if (info.args[0]) {
			let cmd = commands.find((cmd) => cmd.name == info.args[0])
			helpString += `*Command:* ${cmd.name}\n${cmd.description}\n`
		} else {
			helpString = '*Commands:*\n'
			for (const cmd of commands) {
				helpString += cmd.name + ' '
			}
		}

		helpString += `\n*Syntax*: ${config.prefix} <command> <arguments> (optional)\n`

		helpString += `\nYou can add a poop by typing 'cacca++' with all its variants\n`

		helpString += `https://caccabot-client.pages.dev`

		helpString += `\nCaccaBOT ${config.version}-${process.env.ENVIRONMENT ?? 'test'}\n`

		message.reply(helpString)
	},
}
