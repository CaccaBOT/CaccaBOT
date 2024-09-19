const moment = require('moment')
const { addAchievementToUser, getAchievement } = require('../../database')
module.exports = {
	id: 'SHITTY_FAGGOT',
	check: function (poop, user, message) {
		const month = moment(poop.timestamp).month
		if (month == 6) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
