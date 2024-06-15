const { updatePassword } = require('../../database/index')
const { authenticate } = require('../../middleware/auth')

module.exports = async function (fastify, options) {
	fastify.post('/password', async (req, res) => {
		const user = await authenticate(req, res)
		const { password } = req.body
		console.log(user)
		if (!password || password == '') {
			res.send({ error: 'Invalid password' }).code(403)
		}
		updatePassword(user.id, password)
	})
}
