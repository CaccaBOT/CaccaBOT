const { getUserProfileById } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/:id', async (req, res) => {
		const id = req.params['id']
		let user = getUserProfileById(id)
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
