const { poopStatsFromUser, addAchievementToUser, getAchievement } = require('../../database')

module.exports = {
	id: 'PENTAKILL',
	check: function (poop, user, message) {
		const stats = poopStatsFromUser(user.id)
		if (stats.today >= 5) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
