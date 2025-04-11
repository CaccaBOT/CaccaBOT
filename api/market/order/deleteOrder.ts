import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { authenticate } from '../../../middleware/auth'
import {
	getOrder,
	deactivateOrder,
} from '../../../database/index'
import marketLogic from '../../../market'

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

			const order = getOrder(orderId)

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

			if (!order.active) {
				res.code(403).send({
					error: "The order is already inactive.",
				})
			}

			// Logic

			const opResult = deactivateOrder(orderId)

			if (opResult == false) {
				res.code(403).send({
					error: "The collectible ownership couldn't be synchronized."
				})
				return
			}

			marketLogic.updateAllOrders()
			res.code(200).send({
				success: true,
				message: "Order successfully deactivated"
			})
		},
	)
}

export default deleteOrderEndpoint
