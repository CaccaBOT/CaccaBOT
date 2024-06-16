const { getUserProfileByUsername } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/search', async (req, res) => {
		const username = req.query['username']
		let user = getUserProfileByUsername(username)
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
