const { authenticate } = require('../../middleware/auth')

module.exports = async function (fastify, options) {
	fastify.get('/', async (req, res) => {
		const user = await authenticate(req, res)
		if (user) {
			delete user.token
			delete user.password
			delete user.phone
			res.code(200).send(user)
		} else {
			res.code(404).send()
		}
	})
}
