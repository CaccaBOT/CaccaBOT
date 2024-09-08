const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'ESCREMENTAL_WATSON',
	check: function (collectible, user) {
		if (collectible.rarity == 'Escrementale') {
			addAchievementToUser(user.id, this.id)
		}
	},
}
