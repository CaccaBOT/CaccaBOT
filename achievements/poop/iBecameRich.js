const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'I_BECAME_RICH',
	check: function (poop, user, message) {
		//add achievement on poop if not owned
		addAchievementToUser(user.id, this.id)
		message.reply('Ottenuto achievement: Sono diventato ricco!')
	},
}
