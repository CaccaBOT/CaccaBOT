import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import {
	getOrderById,
} from '../../../database/index'

interface Params {
	id: string
}

const viewOrderEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/:id',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const orderId = Number.parseInt(req.params.id)

			const order = getOrderById(orderId)

			// Input validation

			if (!order) {
				res.code(404).send({
					error: "The order doesn't exist.",
				})
				return
			}

			// Logic

			res.code(200).send(order)
		},
	)
}

export default viewOrderEndpoint
