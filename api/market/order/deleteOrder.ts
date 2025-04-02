import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { authenticate } from '../../../middleware/auth'
import {
	getOrderById,
	deleteOrderById,
} from '../../../database/index'

interface Params {
	id: string
}

const deleteOrderEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.delete(
		'/:id',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const orderId = Number.parseInt(req.params.id)

			const user = await authenticate(req, res)

			const order = getOrderById(orderId)

			// Input validation

			if (!order) {
				res.code(404).send({
					error: "The order doesn't exist.",
				})
				return
			}

			if (order.user_id != user.id) {
				res.code(403).send({
					error: "The order is property of another user."
				})
				return
			}

			// Logic

			deleteOrderById(orderId)

			// TODO: desync the user_collectible selling

			// TODO: call the order logic
		},
	)
}

export default deleteOrderEndpoint
