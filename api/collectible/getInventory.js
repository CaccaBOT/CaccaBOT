const { getUserCollectibles } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/inventory/:id', async (req, res) => {
		const id = req.params['id']
		res.code(200).send(getUserCollectibles(id))
	})
}
