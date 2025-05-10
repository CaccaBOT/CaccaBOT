import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import {
	getActiveOrdersByCollectible,
} from '../../../database/index'

interface Params {
	collectibleId: string
}

const viewAllActiveOrdersEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/:collectibleId/all',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const collectibleId = Number.parseInt(req.params.collectibleId)

			res.code(200).send(getActiveOrdersByCollectible(collectibleId))
		},
	)
}

export default viewAllActiveOrdersEndpoint
