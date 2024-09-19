const { getAllAchievements } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/', async (req, res) => {
		res.code(200).send(getAllAchievements())
	})
}
