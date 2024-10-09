import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { getUserProfileByUsername } from '../../database'
import { authenticate } from '../../middleware/auth'
import usernameValidator from '../../validators/username'
import achievementChecker from '../../achievements/check'

interface EditProfileBody {
	username: string,
	bio: string,
	pfp: string
}

const editProfileEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.patch('/edit', async (req: FastifyRequest<{Body: EditProfileBody}>, res: FastifyReply) => {
		const { username, bio, pfp } = req.body
		const user = await authenticate(req, res)

		if (!usernameValidator.validate(username)) {
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

		achievementChecker.checkActionBased(user)
	})
}

export default editProfileEndpoint;