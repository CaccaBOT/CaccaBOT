const { client } = require('../whatsapp/index')
const { poopLeaderboardWithFilter } = require('../database/index')
const config = require('../config.json')

module.exports = {
	name: 'leaderboard',
	description: 'view the monthly poop leaderboard',
	execute: async (message, info) => {
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
		let chat = await message.getChat()
		let mentions = []

		if (chat.isGroup) {
			let participants = chat.participants

			for (const participant of participants) {
				let contact = await client.getContactById(participant.id._serialized)
				mentions.push(contact)
			}

			for (let i = 0; i < leaderboard.length; i++) {
				leaderboardMsg += `${i + 1}° | @${sanitizeId(leaderboard[i].phone)} | ${
					leaderboard[i].poops
				}\n`
			}

			leaderboardMsg += `\nThe leaderboard can be viewed here\n${config.frontendUrl}/leaderboard`
		} else {
			message.reply('This command is only available in groups')
			return
		}

		chat.sendMessage(leaderboardMsg, { mentions })
	},
}

function sanitizeId(id) {
	return id.match(/^\d+/)[0]
}
