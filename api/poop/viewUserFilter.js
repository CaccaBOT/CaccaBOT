const { getPoopsFromUserWithFilter } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/:id/:year/:month', async (req, res) => {
		const { id, year, month } = req.params
		res.send(getPoopsFromUserWithFilter(id, year, month)).code(200)
	})
}
