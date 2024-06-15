const { getUserByToken } = require('../database/index')

async function authenticate(req, res) {
	const token = req.headers['x-auth-token']

	if (!token) {
		res.code(401).send({ error: 'No token was provided (X-Auth-Token header)' })
		return null
	}

	const user = getUserByToken(token)

	if (!user) {
		res.code(401).send({ error: 'Invalid token' })
		return null
	}

	return user
}

module.exports = { authenticate }
