const moment = require('moment')
const { addAchievementToUser, getAchievement } = require('../../database')
module.exports = {
	id: 'TIME_FOR_A_SNACK',
	check: function (poop, user, message) {
		const timestamp = moment(poop.timestamp).hour()
		if (timestamp >= 16 && timestamp < 18) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
