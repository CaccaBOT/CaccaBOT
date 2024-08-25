const moment = require('moment')
const { addAchievementToUser } = require('../database')
module.exports = {
	id: 'POOP_ON_WHEELCHAIR',
	check: function (poop, user, message) {
		const hour = moment(poop.timestamp).hour()
		const minute = moment(poop.timestamp).minute()
		if (hour == 1 && minute == 4) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuta achievement: Cacca a rotelle!')
		}
	},
}
