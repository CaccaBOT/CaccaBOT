const { login } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.post('/login', async (req, res) => {
		const { username, password } = req.body
		const user = await login(username, password)
		if (!user) {
			res.send({ error: 'Invalid credentials' }).code(401)
			return
		}

		delete user.password
		delete user.phone

		res.send(user).code(200)
	})
}
