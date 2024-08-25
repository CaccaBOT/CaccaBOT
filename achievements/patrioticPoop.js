const moment = require('moment')
const { addAchievementToUser } = require('../database/index')
module.exports = {
	id: 'PATRIOTIC_POOP',
	check: function (poop, user, message) {
		const month = moment(poop.timestamp).month
		const day = moment(poop.timestamp).day
		if (month == 6 && day == 2) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuta achievement: Merda patriottica!')
		}
	},
}
