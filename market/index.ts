import { 
    getLastLimitOrderExecuted,
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
    getAllOrderTypes
} from "../database"
import fs from 'node:fs'
import path from 'node:path'


const defaultMarketPrice = 1
const taxationAmount = 0.1

const marketLogic = {
    getMarketPrice(collectibleId: number): number {
        const lastLimitOrder = getLastLimitOrderExecuted(collectibleId)

        if(lastLimitOrder)
            return lastLimitOrder.price

        return defaultMarketPrice
    },

    updateAllOrders() {
        const orderTypesDir = path.resolve(`${__dirname}/orderTypes`)
        fs.readdirSync(orderTypesDir).forEach(async (file) => {
            const orderLogicModule = await import(`${orderTypesDir}/${file}`)
            const orderLogic = orderLogicModule.default
            orderLogic.updateAll()
        })
    },

    executeTransaction(sellOrderId: number, buyOrderId: number, price: number) {
        const sellOrder = getOrder(sellOrderId)
        const buyOrder = getOrder(buyOrderId)
        const sellUser = getUserProfileById(sellOrder.user_id)
        const buyUser = getUserProfileById(buyOrder.user_id)
        const timestamp = new Date()

        updateOrderPrice(sellOrder.id, price)
        updateOrderPrice(buyOrder.id, price)

        executeOrder(sellOrder.id, timestamp)
        executeOrder(buyOrder.id, timestamp)

        // Update userCollectible
        const userCollectibles = 
            getSpecificCollectibleOwnershipsNotSelling(sellUser.id, sellOrder.collectible_id)
        
        if(userCollectibles.length == 0)
            return

        setCollectibleOwnershipUser(userCollectibles[0].id, buyUser.id)

        // Update money
        const taxation = Math.ceil(price * taxationAmount)

        setMoney(sellUser.id, sellUser.money + price - taxation)
        setMoney(buyUser.id, buyUser.money - price)
    }
}

export default marketLogic