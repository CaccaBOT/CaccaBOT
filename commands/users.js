const { client } = require('../whatsapp/index')
const { poopLeaderboard } = require('../database/index')
const config = require('../config.json')

module.exports = {
	name: 'users',
	description: 'view all users',
	execute: async (message, info) => {
		let usersMsg = ''
		const users = poopLeaderboard()
		for (const user of users) {
			usersMsg += `*${user.rank}°* ${user.username} (${user.poops} poops)\n`
		}
		message.reply(usersMsg)
	},
}
