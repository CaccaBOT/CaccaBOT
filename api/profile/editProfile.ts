import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import { authenticate } from '../../middleware/auth'
import usernameValidator from '../../validators/username'
import achievementChecker from '../../achievements/check'
import { isUsernameAvailable } from '../../database'

interface EditProfileBody {
	username: string
	bio: string
	pfp: string
}

const editProfileEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.patch(
		'/edit',
		async (
			req: FastifyRequest<{ Body: EditProfileBody }>,
			res: FastifyReply,
		) => {
			const { username, bio, pfp } = req.body
			const user = await authenticate(req, res)

			if (!usernameValidator.validate(username)) {
				res.code(403).send({ error: 'Invalid username' })
			}

			if (user.username && isUsernameAvailable(user.username)) {
				user.username = username
			}

			if (user.bio) {
				user.bio = bio
			}

			if (user.pfp) {
				user.pfp = pfp
			}

			achievementChecker.checkActionBased(user)
		},
	)
}

export default editProfileEndpoint
