const { getAllUserProfiles } = require('../../database')

module.exports = async function (fastify, options) {
	fastify.get('/all', async (req, res) => {
		let profiles = getAllUserProfiles()
        profiles.forEach(p => delete p.phone)
        res.send(profiles).code(200)
	})
}
