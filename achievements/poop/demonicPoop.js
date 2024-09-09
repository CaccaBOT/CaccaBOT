const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'DEMONIC_POOP',
	check: function (poop, user, message) {
		if (user.money == 666) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuto achievement: Cacca indemoniata!')
		}
	},
}
