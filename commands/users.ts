import { Message } from "whatsapp-web.js"
import { Command, Info } from "../types/Command"
//@ts-ignore
import { poopLeaderboard } from '../database/index'

const users: Command = {
	name: 'users',
	description: 'view all users',
	execute: async (message: Message, info: Info) => {
		let usersMsg = ''
		const users = poopLeaderboard()
		for (const user of users) {
			usersMsg += `*${user.rank}°* ${user.username} (${user.poops} poops)\n`
		}
		message.reply(usersMsg)
	},
}

export default users;
