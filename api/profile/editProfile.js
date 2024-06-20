const { getUserProfileById } = require('../../database')
const { authenticate } = require('../../middleware/auth')

module.exports = async function (fastify, options) {
	fastify.patch('/edit', async (req, res) => {
		const { username, bio, pfp } = req.body
		const user = await authenticate(req, res)
		if (!username || username.length < 3) {
			res.code(403).send({ error: 'Invalid username' })
		}

		user.username = username
	})
}
