const {
	updateProfilePicture,
	checkAchievementForUser,
} = require('../../database')
const { authenticate } = require('../../middleware/auth')
const fs = require('fs')
const path = require('path')

module.exports = async function (fastify, options) {
	fastify.delete('/pfp', async (req, res) => {
		const user = await authenticate(req, res)
		updateProfilePicture(user.id, null)
		checkAchievements(user)
		res.code(200).send()
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
