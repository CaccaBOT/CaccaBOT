const moment = require('moment')
const { addAchievementToUser } = require('../../database')
module.exports = {
	id: 'SHITTY_FAGGOT',
	check: function (poop, user, message) {
		const month = moment(poop.timestamp).month
		if (month == 6) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuto achievement: Frocio di merda!')
		}
	},
}
