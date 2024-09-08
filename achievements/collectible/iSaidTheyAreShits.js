const { addAchievementToUser } = require('../../database')
const { client } = require('../../index')

module.exports = {
	id: 'I_SAID_THEY_ARE_SHITS',
	check: function (collectible, user) {
		if (collectible.rarity == 'Merdume') {
			addAchievementToUser(user.id, this.id)
		}
	},
}
