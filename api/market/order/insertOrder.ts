import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { authenticate } from '../../../middleware/auth'
import {
  getSpecificCollectibleOwnershipsNotSelling,
  createOrder,
  getAllCollectibles,
  getAllOrderSides,
  getAllOrderTypes,
  getOrdersOfUserCreatedAtDay,
  getActiveOrdersByCollectible,
  getBuyActiveOrdersByCollectible,
  getSellActiveOrdersByCollectible
} from '../../../database/index'
import { OrderSide, OrderType } from '../../../types/OrderEnums'
import MarketLogic from '../../../market'
import { server as serverInstance } from '../../../index'

interface Params {
  collectibleId: string
  type: OrderType
  side: OrderSide
  price: number
  quantity: number
}

const insertOrderEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
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

      const userOrdersToday = getOrdersOfUserCreatedAtDay(
        user.id,
        collectibleId,
        new Date()
      )

      if (userOrdersToday.length >= 10) {
        res.code(403).send({
          error: 'You have reached the maximum number of orders for today'
        })
        return
      }

      const existsCollectible = getAllCollectibles()
        .map((collectible) => collectible.id)
        .includes(collectibleId)

      if (!existsCollectible) {
        res.code(404).send({
          error: "The collectible doesn't exist"
        })
        return
      }

      const existsSide = getAllOrderSides()
        .map((side: any) => side.value)
        .includes(side)

      if (!existsSide) {
        res.code(400).send({
          error: 'Illegal order side'
        })
        return
      }

      const existsType = getAllOrderTypes()
        .map((type: any) => type.value)
        .includes(type)

      if (!existsType) {
        res.code(400).send({
          error: 'Illegal order type'
        })
        return
      }

      if (price <= 0 && type != 'MARKET') {
        res.code(400).send({
          error: 'The price must be positive'
        })
        return
      }

      if (quantity <= 0) {
        res.code(400).send({
          error: 'The quantity must be positive'
        })
        return
      }

      switch (side) {
        case 'SELL':
          {
            if (
              type == 'MARKET' &&
              getBuyActiveOrdersByCollectible(collectibleId).length == 0
            ) {
              res.code(400).send({
                error:
                  "You can't place a market sell order because there are no active buy orders"
              })
              return
            }

            const userCollectibles = getSpecificCollectibleOwnershipsNotSelling(
              user.id,
              collectibleId
            )

            if (userCollectibles.length < quantity) {
              res.code(403).send({
                error: "You don't have enough cards of the chosen type"
              })
              return
            }

            createOrder(user.id, collectibleId, type, side, price, quantity)
          }
          break

        case 'BUY':
          {
            if (
              type == 'MARKET' &&
              getSellActiveOrdersByCollectible(collectibleId).length == 0
            ) {
              res.code(400).send({
                error:
                  "You can't place a market buy order because there are no active sell orders"
              })
              return
            }

            createOrder(user.id, collectibleId, type, side, price, quantity)
          }
          break
      }

      MarketLogic.updateAllOrders()

      serverInstance.io.emit('market', {
        collectibleId
      })
    }
  )
}

export default insertOrderEndpoint
