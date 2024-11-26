import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import { commands } from '../whatsapp'
import config from '../config.json'
import { version } from '../package.json'

const help: Command = {
	name: 'help',
	description: 'display a help message',
	execute: (message: Message, info: Info) => {
		let helpString = ''

		if (info.args[0]) {
			const cmd = commands.find((cmd) => cmd.name === info.args[0])
			if (cmd) {
				helpString += `*Command:* ${cmd.name}\n${cmd.description}\n`
			} else {
				helpString += 'Command not found\n'
			}
		} else {
			helpString = '*Commands:*\n'
			for (const cmd of commands) {
				helpString += cmd.name + ' '
			}
		}

		helpString += `\n*Syntax*: ${config.prefix} <command> <arguments> (optional)\n`
		helpString += `\nYou can add a poop by typing 'cacca++' with all its variants\n`
		helpString += `${config.serverUrl}`
		helpString += `\nCaccaBOT ${version}-${process.env.ENVIRONMENT ?? 'test'}\n`

		message.reply(helpString)
	},
}

export default help
