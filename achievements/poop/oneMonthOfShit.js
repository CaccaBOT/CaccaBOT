const { poopStreak, addAchievementToUser, getAchievement } = require('../../database/')
module.exports = {
	id: 'ONE_MONTH_OF_SHIT',
	check: function (poop, user, message) {
		const streak = poopStreak(user.id)
		if (streak >= 30) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
