const { login } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.post('/login', async (req, res) => {
		const { username, password } = req.body
		const user = await login(username, password)
		if (!user) {
			res.code(401).send({ error: 'Invalid credentials' })
			return
		}

		delete user.password
		delete user.phone

		res.code(200).send(user)
	})
}
