const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'WHAT_AN_ASSHOLE',
	check: function (collectible, user) {
		if (collectible.rarity == 'Caccasmagorico') {
			addAchievementToUser(user.id, this.id)
		}
	},
}
