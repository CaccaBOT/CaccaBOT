const { login } = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.post('/login', async (req, res) => {
        // TODO: implement login logic
        res.code(200).send({error: 'Not yet implemented'})
	})
}
