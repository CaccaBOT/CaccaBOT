const { updateUsername, getUserProfileByUsername } = require('../../database')
const { authenticate } = require('../../middleware/auth')

module.exports = async function (fastify, options) {
	fastify.patch('/username', async (req, res) => {
		const { username } = req.body
		const user = await authenticate(req, res)
		if (!username) {
			res.code(403).send({ error: 'Invalid username' })
			return
		}

		const validation = /^[a-zA-Z0-9_]{2,}[a-zA-Z]+[0-9]*$/

		if (!validation.test(username)) {
			res.code(403).send({ error: 'Invalid username' })
			return
		}

		const isUsernameAvailable =
			getUserProfileByUsername(user.username).id == null
		if (isUsernameAvailable) {
			updateUsername(user.id, username)
			res.code(200).send()
			return
		}

		res.code(403).send({ error: 'Username is unavailable' })
	})
}
