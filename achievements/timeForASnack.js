const moment = require('moment')
const { addAchievementToUser } = require('../database')
module.exports = {
	id: 'TIME_FOR_A_SNACK',
	check: function (poop, user, message) {
		const timestamp = moment(poop.timestamp).hour()
		if (timestamp >= 16 && timestamp < 18) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuto achievement: È Tempo Della Merdenda!')
		}
	},
}
