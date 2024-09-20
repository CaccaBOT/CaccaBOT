import { Message } from "whatsapp-web.js"
import { Command, Info } from "../types/Command"
import config from '../config.json'

const manual: Command = {
	name: 'manual',
	description: 'view the poop manual',
	execute: async (message: Message, info: Info) => {
		message.reply(`${config.frontendUrl}/manual`)
	},
}

export default manual;