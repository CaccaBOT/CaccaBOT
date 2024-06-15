const { poopLeaderboard } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/leaderboard', async (req, res) => {
		let leaderboard = poopLeaderboard()
		leaderboard.forEach((x) => {
			delete password
			delete phone
		})
		res.send(leaderboard).code(200)
	})
}
