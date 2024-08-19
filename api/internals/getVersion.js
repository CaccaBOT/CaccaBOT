const config = require('../../config.json')

module.exports = async function (fastify, options) {
	fastify.get('/version', async (req, res) => {
		res.code(200).send({ version: config.version })
	})
}
