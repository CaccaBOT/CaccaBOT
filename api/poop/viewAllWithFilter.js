const { allPoopWithFilter } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/all/:year/:month', async (req, res) => {
        const { year, month } = req.params
		res.code(200).send(allPoopWithFilter(year, month))
	})
}
