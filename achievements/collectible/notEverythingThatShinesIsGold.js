const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'NOT_EVERYTHING_THAT_SHINES_IS_GOLD',
	check: function (collectible, user) {
		if (collectible.rarity == 'Sensazianale') {
			addAchievementToUser(user.id, this.id)
		}
	},
}
