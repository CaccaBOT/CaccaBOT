const { updatePassword } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.post('/password', async (req, res) => {
		// TODO: implement login logic
		res.code(200).send({ error: 'Not yet implemented' })
	})
}
