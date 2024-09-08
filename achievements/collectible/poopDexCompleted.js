const {
	getAllCollectibles,
	getUserCollectibles,
	addAchievementToUser,
} = require('../../database')

module.exports = {
	id: 'POOPDEX_COMPLETED',
	check: function (collectible, user) {
		const collectibles = getAllCollectibles()
		const user_collectibles = getUserCollectibles(user.id)
		if (user_collectibles.length == collectibles.length) {
			addAchievementToUser(user.id, this.id)
		}
		//TODO: write implementation
		// collect all collectibles
	},
}
