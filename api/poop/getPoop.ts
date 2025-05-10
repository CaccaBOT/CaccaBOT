import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { getPoop } from '../../database'

interface Params {
	id: string
}

const getPoopEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/:id',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			let poop = getPoop(parseInt(req.params.id))

			if (!poop) {
				res.code(404).send({ error: 'Poop not found' })
				return
			}

			res.code(200).send(poop)
		},
	)
}

export default getPoopEndpoint
