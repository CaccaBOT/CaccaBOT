const { addAchievementToUser, getAchievement } = require('../../database')

module.exports = {
	id: 'I_BECAME_RICH',
	check: function (poop, user, message) {
		addAchievementToUser(user.id, this.id)
		const achievement = getAchievement(this.id)
		message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
	},
}
