const { getUserAchievements } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/:id', async (req, res) => {
		const id = req.params['id']
		res.code(200).send(getUserAchievements(id))
	})
}
