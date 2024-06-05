const { poopLeaderboardWithFilter } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/leaderboard/:year/:month', async (req, res) => {
		const { year, month } = req.params
		let leaderboard = poopLeaderboardWithFilter(year, month)
		leaderboard.forEach((x) => delete x.phone)
		res.send(leaderboard).code(200)
	})
}
