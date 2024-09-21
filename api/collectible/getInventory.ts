import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify"

import { getUserCollectibles } from '../../database'

interface Params {
	id: string
}

const getInventoryEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.get('/inventory/:id', async (req: FastifyRequest<{Params: Params}>, res: FastifyReply) => {
		const id = req.params['id']
		res.code(200).send(getUserCollectibles(id))
	})
}

export default getInventoryEndpoint;
