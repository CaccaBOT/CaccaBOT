const { getPoopsFromUser } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/:id', async (req, res) => {
		let id = req.params.id
		res.code(200).send(getPoopsFromUser(id))
	})
}
