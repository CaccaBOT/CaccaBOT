const moment = require('moment')
const { addAchievementToUser, getAchievement } = require('../../database')
module.exports = {
	id: 'INSTANT_EFFECT',
	check: function (poop, user, message) {
		const timestamp = moment(poop.timestamp).hour()
		if (timestamp >= 12 && timestamp < 14) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
