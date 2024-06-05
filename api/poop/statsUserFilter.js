const { poopStatsFromUserWithFilter } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/stats/:id/:year/:month', async (req, res) => {
		const { id, year, month } = req.params
		res.send(poopStatsFromUserWithFilter(id, year, month)).code(200)
	})
}
