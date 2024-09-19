const {
	getUserProfileById,
	getUserProfileByUsername,
	checkAchievementForUser,
} = require('../../database')
const { authenticate } = require('../../middleware/auth')
const fs = require('fs')
const path = require('path')

module.exports = async function (fastify, options) {
	fastify.patch('/edit', async (req, res) => {
		const { username, bio, pfp } = req.body
		const user = await authenticate(req, res)
		if (!username || username.length < 3) {
			res.code(403).send({ error: 'Invalid username' })
		}

		if (user.username && user.username.length >= 3) {
			const isUsernameAvailable =
				getUserProfileByUsername(user.username).id == null
			if (isUsernameAvailable) {
				user.username = username
			}
		}

		if (user.bio) {
			user.bio = bio
		}

		if (user.pfp) {
			user.pfp = pfp
		}
		checkAchievements(user)
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
