import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { updateProfilePicture } from '../../database'
import { authenticate } from '../../middleware/auth'
import achievementChecker from "../../achievements/check"

const deletePfpEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.delete('/pfp', async (req: FastifyRequest, res: FastifyReply) => {
		const user = await authenticate(req, res)
		updateProfilePicture(user.id, null)
		achievementChecker.checkActionBased(user)
		res.code(200).send()
	})
}

export default deletePfpEndpoint;