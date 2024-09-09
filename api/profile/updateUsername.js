const {
	updateUsername,
	getUserProfileByUsername,
	checkAchievementForUser,
} = require('../../database')
const { authenticate } = require('../../middleware/auth')
const fs = require('fs')
const path = require('path')

module.exports = async function (fastify, options) {
	fastify.patch('/username', async (req, res) => {
		const { username } = req.body
		const user = await authenticate(req, res)
		if (!username) {
			res.code(403).send({ error: 'Invalid username' })
			return
		}

		const validation = /^[a-zA-Z0-9_]{2,}[a-zA-Z]+[0-9]*$/

		if (!validation.test(username)) {
			res.code(403).send({ error: 'Invalid username' })
			return
		}

		const isUsernameAvailable = getUserProfileByUsername(username).id == null
		if (isUsernameAvailable) {
			updateUsername(user.id, username)
			checkAchievements(user)
			res.code(200).send()
			return
		}

		res.code(403).send({ error: 'Username is unavailable' })
	})
}

function checkAchievements(user) {
	const achievementsDir = path.resolve(`${__dirname}/../../achievements/action`)
	fs.readdirSync(achievementsDir).forEach((file) => {
		const achievement = require(`${achievementsDir}/${file}`)
		if (!checkAchievementForUser(user.id, achievement.id)) {
			achievement.check(user)
		}
	})
}
