const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'THE_FIRST_OF_A_LONG_TIME',
	check: function (collectible, user) {
		addAchievementToUser(user.id, this.id)
	},
}
