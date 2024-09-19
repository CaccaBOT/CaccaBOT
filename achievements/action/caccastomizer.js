const { addAchievementToUser } = require('../../database')

module.exports = {
	id: 'CACCASTOMIZER',
	check: function (user) {
		addAchievementToUser(user.id, this.id)
	},
}
