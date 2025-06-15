import {
  getSellActiveOrdersByCollectibleAndType,
  getBuyActiveOrdersByCollectibleAndType,
  getAllCollectibles,
  getOrder,
  updateOrderPrice,
  executeOrder,
  getUserProfileById,
  setMoney,
  getSpecificCollectibleOwnershipsNotSelling,
  setCollectibleOwnershipUser,
  db,
  getMarketPriceHistory,
  getLastOrderExecuted,
  getOrdersExecutedInDay,
  addMarketPriceHistory
} from '../database'
import { Order } from '../types/Order'
import { compareDays } from '../utilities'
import { server } from '../index'
import moment from 'moment'
import { config } from '../config/loader'
import { OrderType } from '../types/OrderEnums'

const taxationAmount = 0.1

const MarketLogic = {
  getMarketPrice(collectibleId: number, day: Date): number | null {
    if (compareDays(day, new Date()) < 0) {
      return getMarketPriceHistory(collectibleId, day)?.close_price
    }

    const lastOrder = getLastOrderExecuted(collectibleId)

    if (!lastOrder) {
      return null
    }

    return lastOrder.price
  },

  getDailyVariation(collectibleId: number, day: Date): number | null {
    const yesterday = new Date(day)
    yesterday.setDate(yesterday.getDate() - 1)

    const currentMarketPrice = this.getMarketPrice(collectibleId, day)
    const previousMarketPrice = this.getMarketPrice(collectibleId, yesterday)

    if (!currentMarketPrice || !previousMarketPrice) {
      return null
    }

    return (currentMarketPrice / previousMarketPrice - 1) * 100
  },

  getTaxedPrice(price: number): number {
    return price - Math.ceil(price * taxationAmount)
  },

  executeTransaction(sellOrderId: number, buyOrderId: number, price: number) {
    const sellOrder = getOrder(sellOrderId)
    const buyOrder = getOrder(buyOrderId)
    const sellUser = getUserProfileById(sellOrder.user_id)
    const buyUser = getUserProfileById(buyOrder.user_id)
    const timestamp = new Date()
    const collectibleId = sellOrder.collectible_id

    if (buyUser.money < price) {
      return
    }

    db.transaction(() => {
      updateOrderPrice(sellOrder.id, price)
      updateOrderPrice(buyOrder.id, price)

      executeOrder(sellOrder.id, timestamp)
      executeOrder(buyOrder.id, timestamp)

      const userCollectibles = getSpecificCollectibleOwnershipsNotSelling(
        sellUser.id,
        sellOrder.collectible_id
      )
      if (userCollectibles.length === 0) return

      setCollectibleOwnershipUser(userCollectibles[0].id, buyUser.id)

      setMoney(sellUser.id, sellUser.money + this.getTaxedPrice(price))
      setMoney(buyUser.id, buyUser.money - price)
    })()

    this.saveMarketHistory(collectibleId)

    server.io.emit('market', {
      collectibleId
    })
  },

  saveMarketHistory(collectibleId: number) {
    const day = moment().tz(config.timezone).startOf('day').utc().toDate()
    const actualDay = new Date(day)
    actualDay.setHours(actualDay.getHours() + 2)
    const orders = getOrdersExecutedInDay(collectibleId, day)

    if (!orders || orders.length == 0) {
      const yesterday = moment()
        .subtract(1, 'day')
        .tz(config.timezone)
        .startOf('day')
        .clone()
        .utc()
        .toDate()
      const previousMarketHistory = getMarketPriceHistory(
        collectibleId,
        yesterday
      )

      if (!previousMarketHistory) {
        addMarketPriceHistory(collectibleId, day, {
          openPrice: null,
          closePrice: null,
          highPrice: null,
          lowPrice: null
        })
      } else {
        addMarketPriceHistory(collectibleId, day, {
          openPrice: previousMarketHistory.open_price,
          closePrice: previousMarketHistory.close_price,
          highPrice: previousMarketHistory.high_price,
          lowPrice: previousMarketHistory.low_price
        })
      }
    } else {
      const openPrice = orders[0].price
      const closePrice = orders[orders.length - 1].price
      const highPrice = Math.max(...orders.map((x) => x.price))
      const lowPrice = Math.min(...orders.map((x) => x.price))
      addMarketPriceHistory(collectibleId, day, {
        openPrice,
        closePrice,
        highPrice,
        lowPrice
      })
    }
  },

  findMatchingSellOrder(buyOrder: Order): Order | null {
    const sellOrders = [
      ...getSellActiveOrdersByCollectibleAndType(
        buyOrder.collectible_id,
        'LIMIT'
      )
        .filter((order) => order.user_id !== buyOrder.user_id)
        .map((order) => ({ ...order, effectivePrice: order.price }))
    ]

    if (buyOrder.type !== 'MARKET') {
      sellOrders.push(
        ...getSellActiveOrdersByCollectibleAndType(
          buyOrder.collectible_id,
          'MARKET'
        )
          .filter((order) => order.user_id !== buyOrder.user_id)
          .map((order) => ({ ...order, effectivePrice: buyOrder.price }))
      )
    }

    // MARKET buyOrder (wants best price)
    if (buyOrder.price === null) {
      sellOrders.sort((a, b) => a.effectivePrice - b.effectivePrice) // Lower is better
      return sellOrders.length > 0 ? sellOrders[0] : null
    }

    // LIMIT buyOrder: must find a seller asking <= buy price
    const matchingSellOrders = sellOrders.filter(
      (order) => order.effectivePrice <= buyOrder.price
    )
    matchingSellOrders.sort((a, b) => a.effectivePrice - b.effectivePrice) // Cheapest first

    return matchingSellOrders.length > 0 ? matchingSellOrders[0] : null
  },

  updateOrdersForType(orderType: OrderType) {
    const collectibles = getAllCollectibles()

    for (const collectible of collectibles) {
      const collectibleId = collectible.id
      const buyOrders = getBuyActiveOrdersByCollectibleAndType(
        collectibleId,
        orderType
      )
      const marketPrice = this.getMarketPrice(collectibleId, new Date())

      for (const buyOrder of buyOrders) {
        const sellOrder = this.findMatchingSellOrder(buyOrder)

        if (sellOrder) {
          let priceToUse = null

          if (sellOrder.price !== null) {
            priceToUse = sellOrder.price
          } else if (buyOrder.price !== null) {
            priceToUse = buyOrder.price
          }

          if (priceToUse === null) {
            continue
          }

          this.executeTransaction(sellOrder.id, buyOrder.id, priceToUse)
        }
      }
    }
  },

  updateAllOrders() {
    this.updateOrdersForType('MARKET')
    this.updateOrdersForType('LIMIT')
  }
}

export default MarketLogic
