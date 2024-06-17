const { updatePassword } = require('../../database/index')
const { authenticate } = require('../../middleware/auth')

module.exports = async function (fastify, options) {
	fastify.post('/password', async (req, res) => {
		const user = await authenticate(req, res)
		const { password } = req.body
		if (!password || password.length < 3) {
			res.code(403).send({ error: 'Invalid password' })
		}
		updatePassword(user.id, password)
	})
}
