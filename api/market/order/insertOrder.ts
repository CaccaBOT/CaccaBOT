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
  getBuyActiveOrdersByCollectible,
  getSellActiveOrdersByCollectible
} from '../../../database/index'
import { OrderSide, OrderType } from '../../../types/OrderEnums'
import MarketLogic from '../../../market'
import { server as serverInstance } from '../../../index'
import { config } from '../../../config/loader'
import { client } from '../../../discord/client'
import log from 'loglevel'
import { EmbedBuilder, TextChannel } from 'discord.js'
import { events } from '../../../middleware/events'
import { EventTypeEnum } from '../../../types/events/EventType'
import { MarketActionEnum } from '../../../types/events/MarketActionEnum'
import { Order } from '../../../types/Order'

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

      let orders: Order[] = []

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

            orders.push(
              ...createOrder(
                user.id,
                collectibleId,
                type,
                side,
                price,
                quantity
              )
            )
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

            orders.push(
              ...createOrder(
                user.id,
                collectibleId,
                type,
                side,
                price,
                quantity
              )
            )
          }
          break
      }

      MarketLogic.updateAllOrders()

      serverInstance.io.emit('market', {
        collectibleId
      })

      events.emit(EventTypeEnum.MARKET, {
        action: MarketActionEnum.NEW_ORDER,
        user,
        orders
      })

      if (config.discordModuleEnabled) {
        let channels = client.guilds.cache.get(config.guildId)?.channels.cache
        let marketChannel = channels?.find((c) => c.name === 'market')

        if (!marketChannel) {
          log.warn("Market channel not found, orders won't be broadcasted!")
          return
        }

        let channel = await client.channels.fetch(marketChannel.id)

        if (channel instanceof TextChannel) {
          const collectible = getAllCollectibles().find(
            (c) => c.id === collectibleId
          )

          const embed = new EmbedBuilder()
            .setTitle(`🧾 New ${side === 'BUY' ? 'Buy' : 'Sell'} Order`)
            .setColor(side === 'BUY' ? 0x00b0f4 : 0xff5050)
            .setThumbnail(collectible?.asset_url || '')
            .addFields(
              { name: 'User', value: `<@${user.id}>`, inline: true },
              {
                name: 'Collectible',
                value: collectible?.name ?? `#${collectibleId}`,
                inline: true
              },
              { name: 'Side', value: side, inline: true },
              { name: 'Type', value: type, inline: true },
              { name: 'Quantity', value: quantity.toString(), inline: true },
              ...(type === 'LIMIT'
                ? [
                    { name: 'Price per Unit', value: `${price}`, inline: true },
                    {
                      name: 'Total Price',
                      value: `${price * quantity}`,
                      inline: true
                    }
                  ]
                : [])
            )
            .setTimestamp()
            .setFooter({ text: 'Market Order System' })

          await channel.send({ embeds: [embed] })
        } else {
          log.warn('Fetched market channel is not a text channel!')
        }
      }
    }
  )
}

export default insertOrderEndpoint
