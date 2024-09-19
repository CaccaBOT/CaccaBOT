const moment = require('moment')
const { addAchievementToUser, getAchievement } = require('../../database')
module.exports = {
	id: 'SKIBIDI_TOILET',
	check: function (poop, user, message) {
		const hour = moment(poop.timestamp).hour()
		const minute = moment(poop.timestamp).minute()
		if ((hour == 3 && minute <= 5) || (hour == 2 && minute >= 55)) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
