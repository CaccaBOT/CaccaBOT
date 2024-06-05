const { getPoopsFromUser } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/:id', async (req, res) => {
		let id = req.params.id
		res.send(getPoopsFromUser(id)).code(200)
	})
}
