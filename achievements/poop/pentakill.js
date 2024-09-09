const { poopStatsFromUser, addAchievementToUser } = require('../../database')

module.exports = {
	id: 'PENTAKILL',
	check: function (poop, user, message) {
		const stats = poopStatsFromUser(user.id)
		if (stats.today >= 5) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuto achievement: Pentakill!')
		}
	},
}
