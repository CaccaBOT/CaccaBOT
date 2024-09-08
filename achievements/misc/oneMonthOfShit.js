const { poopStreak, addAchievementToUser } = require('../../database/')
module.exports = {
	id: 'ONE_MONTH_OF_SHIT',
	check: function (poop, user, message) {
		const streak = poopStreak(user.id)
		if (streak >= 30) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuta achievement: Un mese di merda!')
		}
	},
}
