const { addAchievementToUser, getAchievement} = require('../../database')

module.exports = {
	id: 'DEMONIC_POOP',
	check: function (poop, user, message) {
		if (user.money == 666) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
