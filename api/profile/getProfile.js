const { getUserProfileById } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/:id', async (req, res) => {
		const id = req.params['id']
		let user = getUserProfileById(id)
		if (user) {
			delete user.phone
			res.send(user).code(200)
		} else {
			res.send().code(404)
		}
	})
}
