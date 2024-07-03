const { poopLeaderboard } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/leaderboard', async (req, res) => {
		let leaderboard = poopLeaderboard()
		leaderboard.forEach((x) => {
			delete x.phone
		})
		res.code(200).send(leaderboard)
	})
}
