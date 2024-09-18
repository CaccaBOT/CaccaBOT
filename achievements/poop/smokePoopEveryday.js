const moment = require('moment')
const { addAchievementToUser, getAchievement } = require('../../database')
module.exports = {
	id: 'SMOKE_POOP_EVERYDAY',
	check: function (poop, user, message) {
		const hour = moment(poop.timestamp).hour()
		const minute = moment(poop.timestamp).minute()
		if (hour == 4 && minute == 20) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
