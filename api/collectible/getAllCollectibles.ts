import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { getAllCollectibles } from '../../database'

const getAllCollectiblesEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/list',
		async (req: FastifyRequest, res: FastifyReply) => {
			res.code(200).send(getAllCollectibles())
		},
	)
}

export default getAllCollectiblesEndpoint
