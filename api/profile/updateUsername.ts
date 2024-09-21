import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { updateUsername, getUserProfileByUsername, checkAchievementForUser } from '../../database'
import { authenticate } from '../../middleware/auth'
import fs from 'fs'
import path from 'path'
import { RawUser } from '../../types/User'

interface UpdateUsernameBody {
	username: string
}

const updateUsernameEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.patch('/username', async (req: FastifyRequest<{Body: UpdateUsernameBody}>, res: FastifyReply) => {
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

export default updateUsernameEndpoint;