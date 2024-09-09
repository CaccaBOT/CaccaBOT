const {
	addAchievementToUser,
	getUserCollectibles,
	getAllCollectibles,
} = require('../../database')

module.exports = {
	id: 'POOP_SOMMELIER',
	check: function (collectible, user) {
		const collectibles = getAllCollectibles()
		const user_collectibles = getUserCollectibles(user.id)
		if (user_collectibles.length >= collectibles.length / 2) {
			addAchievementToUser(user.id, this.id)
		}
	},
}
