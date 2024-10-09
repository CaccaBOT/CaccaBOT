import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { updateUsername, getUserProfileByUsername, checkAchievementForUser } from '../../database'
import { authenticate } from '../../middleware/auth'
import usernameValidator from '../../validators/username'
import achievementChecker from '../../achievements/check'

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

		if (usernameValidator.validate(username)) {
			res.code(403).send({ error: 'Invalid username' })
			return
		}

		const isUsernameAvailable = getUserProfileByUsername(username).id == null
		if (isUsernameAvailable) {
			updateUsername(user.id, username)
			achievementChecker.checkActionBased(user)
			res.code(200).send()
			return
		}

		res.code(403).send({ error: 'Username is unavailable' })
	})
}

export default updateUsernameEndpoint;