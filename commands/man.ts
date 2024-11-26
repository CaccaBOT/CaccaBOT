import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import { commands } from '../whatsapp'

const man: Command = {
	name: 'man',
	description: 'alias to manual',
	execute: async (message: Message, info: Info) => {
		commands.find((x: Command) => x.name == 'manual')?.execute(message, info)
	},
}

export default man
