import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { getOrdersOfUser } from '../../../database/index'
import { authenticate } from '../../../middleware/auth'

interface Params {
	collectibleId: string
}

const viewUserOrdersEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/:collectibleId', async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
		const collectibleId = Number.parseInt(req.params.collectibleId)
		const user = await authenticate(req, res)
		
		res.code(200).send(getOrdersOfUser(user.id, collectibleId))
	})
}

export default viewUserOrdersEndpoint
