const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'POOPATIC',
	check: function (collectible, user) {
		if (user.openedPacks >= 50) {
			addAchievementToUser(user.id, this.id)
		}
	},
}
