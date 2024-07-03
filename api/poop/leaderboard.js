const { poopLeaderboard } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/leaderboard', async (req, res) => {
		res.code(200).send(poopLeaderboard())
	})
}
