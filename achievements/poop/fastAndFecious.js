const {
	poopLeaderboardWithFilter,
	addAchievementToUser,
} = require('../../database')
const moment = require('moment')

module.exports = {
	id: 'FAST_AND_FECIOUS',
	check: function (poop, user, message) {
		const year = moment().year()
		const month = moment().month()
		const leaderboard = poopLeaderboardWithFilter(year, month)
		if (leaderboard.length == 1) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuto achievement: Fast & Fecious!')
		}
	},
}
