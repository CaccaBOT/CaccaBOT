import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import { configuration } from '..'

const manual: Command = {
	name: 'manual',
	description: 'view the poop manual',
	execute: async (message: Message, info: Info) => {
		message.reply(`${configuration.serverUrl}/manual`)
	},
}

export default manual
