const { poopLeaderboardWithFilter } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/leaderboard/:year/:month', async (req, res) => {
		const { year, month } = req.params
		res.code(200).send(poopLeaderboardWithFilter(year, month))
	})
}
