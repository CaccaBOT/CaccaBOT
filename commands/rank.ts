import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import { commands } from '../whatsapp'

const rank: Command = {
	name: 'rank',
	description: 'alias to leaderboard',
	execute: async (message: Message, info: Info) => {
		commands.find((x) => x.name == 'leaderboard')?.execute(message, info)
	},
}

export default rank
