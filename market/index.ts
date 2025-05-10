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
    getLastOrderExecuted
} from "../database"
import { Order } from "../types/Order"
import { compareDays } from "../utilities"

const defaultMarketPrice = 1
const taxationAmount = 0.1

type OrderType = 'LIMIT' | 'MARKET'

const MarketLogic = {
    getMarketPrice(collectibleId: number, day: Date): number {
        if (compareDays(day, new Date()) < 0) {
            return getMarketPriceHistory(collectibleId, day).close_price
        }
        
        const lastOrder = getLastOrderExecuted(collectibleId)

        if (!lastOrder) {
            return defaultMarketPrice
        }

        return lastOrder.price
    },

    getDailyVariation(collectibleId: number, day: Date): number {
        const yesterday = new Date(day)
        yesterday.setDate(yesterday.getDate() - 1)

        const currentMarketPrice = this.getMarketPrice(collectibleId, day)
        const previousMarketPrice = this.getMarketPrice(collectibleId, yesterday)

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

        if (buyUser.money < price) {
            return
        }

        db.transaction(() => {
            updateOrderPrice(sellOrder.id, price)
            updateOrderPrice(buyOrder.id, price)

            executeOrder(sellOrder.id, timestamp)
            executeOrder(buyOrder.id, timestamp)

            const userCollectibles = getSpecificCollectibleOwnershipsNotSelling(sellUser.id, sellOrder.collectible_id)
            if (userCollectibles.length === 0) return

            setCollectibleOwnershipUser(userCollectibles[0].id, buyUser.id)

            setMoney(sellUser.id, sellUser.money + this.getTaxedPrice(price))
            setMoney(buyUser.id, buyUser.money - price)
        })()
    },

    findMatchingBuyOrder(sellOrder: Order): Order | null {
        const buyOrdersMarket = getBuyActiveOrdersByCollectibleAndType(sellOrder.collectible_id, 'MARKET')
            .filter(order => order.user_id !== sellOrder.user_id)
        const buyOrdersLimit = getBuyActiveOrdersByCollectibleAndType(sellOrder.collectible_id, 'LIMIT')
            .filter(order => order.user_id !== sellOrder.user_id)

        if (buyOrdersMarket.length > 0) {
            return buyOrdersMarket[0]
        }

        buyOrdersLimit.sort((a, b) => b.price - a.price)

        for (const buyOrder of buyOrdersLimit) {
            if (buyOrder.price >= sellOrder.price) {
                return buyOrder
            }
        }

        return null
    },

    updateOrdersForType(orderType: OrderType) {
        const collectibles = getAllCollectibles()

        for (const collectible of collectibles) {
            const collectibleId = collectible.id
            const sellOrders = getSellActiveOrdersByCollectibleAndType(collectibleId, orderType)
            const marketPrice = this.getMarketPrice(collectibleId, new Date())

            for (const sellOrder of sellOrders) {
                const buyOrder = this.findMatchingBuyOrder(sellOrder)

                if (buyOrder) {
                    const priceToUse = orderType === 'MARKET' ? marketPrice : sellOrder.price
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
