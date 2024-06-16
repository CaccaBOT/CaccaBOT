const { poopStatsFromUser } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/stats/:id', async (req, res) => {
		const { id } = req.params
		res.code(200).send(poopStatsFromUser(id))
	})
}
