import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { authenticate } from '../../../middleware/auth'
import {
	getSpecificCollectibleOwnershipsNotSelling,
	createOrder,
	getAllCollectibles,
	getAllOrderSides,
	getAllOrderTypes,
	updateCollectibleOwnershipToSelling,
} from '../../../database/index'
import { OrderSide, OrderType } from '../../../types/OrderEnums'
import MarketLogic from '../../../market'

interface Params {
	collectibleId: string
	type: OrderType
	side: OrderSide
	price: number
	quantity: number
}

const insertOrderEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.post(
		'/',
		async (req: FastifyRequest<{ Body: Params }>, res: FastifyReply) => {
			const collectibleId = Number.parseInt(req.body.collectibleId)
			const type = req.body.type
			const side = req.body.side
			const price = req.body.price
			const quantity = req.body.quantity

			const user = await authenticate(req, res)

			// Input validation

			const existsCollectible = getAllCollectibles()
				.map(collectible => collectible.id)
				.includes(collectibleId)
			
			if (!existsCollectible) {
				res.code(404).send({
					error: "The collectible doesn't exist.",
				})
				return
			}

			const existsSide = getAllOrderSides()
				.map((side: any) => side.value)
				.includes(side)

			if (!existsSide) {
				res.code(400).send({
					error: "Illegal order side.",
				})
				return
			}

			const existsType = getAllOrderTypes()
				.map((type: any) => type.value)
				.includes(type)

			if (!existsType) {
				res.code(400).send({
					error: "Illegal order type.",
				})
				return
			}

			if (price <= 0 && type != 'MARKET') {
				res.code(400).send({
					error: "The price must be positive.",
				})
				return
			}

			if (quantity <= 0) {
				res.code(400).send({
					error: "The quantity must be positive.",
				})
				return
			}

			// Logic

			switch (side) {
				case 'SELL': {
					const userCollectibles = getSpecificCollectibleOwnershipsNotSelling(
						user.id,
						collectibleId,
					)

					if (userCollectibles.length < quantity) {
						res.code(403).send({
							error: "You don't have enough cards of the chosen type.",
						})
						return
					}

					createOrder(user.id, collectibleId, type, side, price, quantity)
				}
				break

				case 'BUY': {
					createOrder(user.id, collectibleId, type, side, price, quantity)
				}
				break
			}
			MarketLogic.updateAllOrders()
		},
	)
}

export default insertOrderEndpoint
