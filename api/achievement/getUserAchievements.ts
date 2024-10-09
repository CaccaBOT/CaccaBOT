import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import { getUserAchievements } from '../../database'

interface Params {
	id: string
}

const getUserAchievementsEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/:id',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const id = req.params['id']
			res.code(200).send(getUserAchievements(id))
		},
	)
}

export default getUserAchievementsEndpoint
