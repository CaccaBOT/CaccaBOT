const { poopStreak, addAchievementToUser, getAchievement } = require('../../database/')
module.exports = {
	id: 'SCAT_LOVER',
	check: function (poop, user, message) {
		const streak = poopStreak(user.id)
		if (streak >= 69) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
