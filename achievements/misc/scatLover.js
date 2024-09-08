const { poopStreak, addAchievementToUser } = require('../../database/')
module.exports = {
	id: 'SCAT_LOVER',
	check: function (poop, user, message) {
		const streak = poopStreak(user.id)
		if (streak >= 69) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuta achievement: Scat lover!')
		}
	},
}
