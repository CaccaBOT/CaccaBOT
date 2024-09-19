const {
	poopLeaderboardWithFilter,
	addAchievementToUser,
	getAchievement
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
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
