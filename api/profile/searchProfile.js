const { getUserProfileByUsername } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/search', async (req, res) => {
		const username = req.query['username']
		let user = getUserProfileByUsername(username)
		if (user) {
			delete user.phone
			res.send(user).code(200)
		} else {
			res.send().code(404)
		}
	})
}
