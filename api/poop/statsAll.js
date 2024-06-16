const { poopStats } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/stats', async (req, res) => {
		res.code(200).send(poopStats())
	})
}
