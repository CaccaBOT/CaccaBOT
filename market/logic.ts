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
    setCollectibleOwnershipUser
} from "../database"
import { Collectible } from "../types/Collectible"


const taxationAmount = 0.1

const marketLogic = {
    getMarketPrice(collectibleId: number): number {
        return getLastLimitOrderExecuted(collectibleId).price
    },

    updateAllOrders() {
        updateAllMarketOrders()
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
        const taxation = Math.floor(price * taxationAmount)

        setMoney(sellUser.id, sellUser.money + price - taxation)
        setMoney(buyUser.id, buyUser - price)
    }

}

// TODO: (maybe) put this all below into the specific files in ./orderTypes

function updateAllMarketOrders() {
    const collectibles = getAllCollectibles()

    for(let i in collectibles)
        updateMarketOrders(collectibles[i].id)
}

// INFO: if a single user creates a market sell order and a market buy order for the same collectible id
// the may be linked together
function updateMarketOrders(collectibleId: number) {
    const sellOrders = getSellActiveOrdersByCollectibleAndType(collectibleId, 'MARKET')
    const buyOrders = getBuyActiveOrdersByCollectibleAndType(collectibleId, 'MARKET')
    const marketPrice = marketLogic.getMarketPrice(collectibleId)

    let i = 0

    while (i < sellOrders.length && i < buyOrders.length)
    {
        const sellOrder = sellOrders[i]
        const buyOrder = buyOrders[i]

        marketLogic.executeTransaction(sellOrder.id, buyOrder.id, marketPrice)

        i++
    }
}

export default marketLogic