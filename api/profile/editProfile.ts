import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { getUserProfileById, getUserProfileByUsername, checkAchievementForUser } from '../../database'
import { authenticate } from '../../middleware/auth'
import fs from 'fs'
import path from 'path'
import { RawUser } from '../../types/User'

interface EditProfileBody {
	username: string,
	bio: string,
	pfp: string
}


const editProfileEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.patch('/edit', async (req: FastifyRequest<{Body: EditProfileBody}>, res: FastifyReply) => {
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

function checkAchievements(user: RawUser) {
	const achievementsDir = path.resolve(`${__dirname}/../../achievements/action`)
	fs.readdirSync(achievementsDir).forEach(async (file) => {
		const achievementModule = await import(`${achievementsDir}/${file}`)
		const achievement = achievementModule.default
		if (!checkAchievementForUser(user.id, achievement.id)) {
			achievement.check(user)
		}
	})
}

export default editProfileEndpoint;