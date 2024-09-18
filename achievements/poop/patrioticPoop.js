const moment = require('moment')
const { addAchievementToUser, getAchievement } = require('../../database/')
module.exports = {
	id: 'PATRIOTIC_POOP',
	check: function (poop, user, message) {
		const month = moment(poop.timestamp).month
		const day = moment(poop.timestamp).day
		if (month == 5 && day == 2) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
