import { whatsappClient } from '../whatsapp/index'
import { poopLeaderboardWithFilter } from '../database/index'
import { GroupChat, Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import { config } from '../config/loader'

const leaderboard: Command = {
	name: 'leaderboard',
	description: 'view the monthly poop leaderboard',
	execute: async (message: Message, info: Info) => {
		const now = new Date()
		let leaderboard = poopLeaderboardWithFilter(
			now.getFullYear(),
			now.getMonth() + 1,
		)
		let leaderboardMsg = `Leaderboard for ${new Date().toLocaleDateString(
			'default',
			{ year: 'numeric', month: 'long' },
		)}\n`
		leaderboardMsg += `*Rank* | *User* | *Count*\n`
		let chat = (await message.getChat()) as GroupChat
		let mentions = [] as any

		if (chat.isGroup) {
			let participants = chat.participants

			for (const participant of participants) {
				let contact = await whatsappClient.getContactById(participant.id._serialized)
				mentions.push(contact)
			}

			for (let i = 0; i < leaderboard.length; i++) {
				leaderboardMsg += `${i + 1}° | @${sanitizeId(leaderboard[i].phone)} | ${
					leaderboard[i].poops
				}\n`
			}

			leaderboardMsg += `\nThe leaderboard can be viewed here\n${config.serverUrl}/leaderboard`
		} else {
			message.reply('This command is only available in groups')
			return
		}

		chat.sendMessage(leaderboardMsg, { mentions })
	},
}

function sanitizeId(id: string): string | null {
	const match = id.match(/^\d+/)
	return match ? match[0] : null
}

export default leaderboard
