const moment = require('moment')
const { addAchievementToUser, getAchievement } = require('../../database')

module.exports = {
	id: 'LAST_MINUTE',
	check: function (poop, user, message) {
		const date = moment.utc(poop.timestamp)
		const lastSecondOfMonth = moment.utc(date).endOf('month')
		const lastMinuteOfMonth = moment
			.utc(lastSecondOfMonth)
			.subtract(59, 'seconds')
		if (date.isBetween(lastMinuteOfMonth, lastSecondOfMonth, null, '[]')) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}
