import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

const { poopStatsFromUser } = require('../../database/index')

interface Params {
	id: string
}

const statsUser = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/stats/:id',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const { id } = req.params
			res.code(200).send(poopStatsFromUser(id))
		},
	)
}

export default statsUser
