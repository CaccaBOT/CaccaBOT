import marketLogic from ".."
import { getAllCollectibles, getBuyActiveOrdersByCollectibleAndType, getSellActiveOrdersByCollectibleAndType } from "../../database"
import { Order } from "../../types/Order"
import { OrderLogic } from "../../types/OrderLogic"


const limit: OrderLogic = {
    id: 'LIMIT',
    updateAll: function() {
        const collectibles = getAllCollectibles()
        
        for(const i in collectibles)
            updateLimitOrders(collectibles[i].id)
    }
}

function updateLimitOrders(collectibleId: number) {
    const sellOrders = getSellActiveOrdersByCollectibleAndType(collectibleId, 'LIMIT')

    let i = 0

    while (i < sellOrders.length)
    {
        const sellOrder = sellOrders[i]
        const buyOrder = findMatchingBuyOrder(sellOrder)

        if(buyOrder)
            marketLogic.executeTransaction(sellOrder.id, buyOrder.id, sellOrder.price)

        i++
    }
}

function findMatchingBuyOrder(sellOrder: Order): Order | null {
    const buyOrdersMarket = getBuyActiveOrdersByCollectibleAndType(sellOrder.collectible_id, 'MARKET');
    const buyOrdersLimit = getBuyActiveOrdersByCollectibleAndType(sellOrder.collectible_id, 'LIMIT');
    
    if (buyOrdersMarket.length > 0) {
        const buyOrderMarket = buyOrdersMarket[0];
        return buyOrderMarket;
    }

    buyOrdersLimit.sort((x, y) => y.price - x.price);

    for (const buyOrder of buyOrdersLimit) {
        if (buyOrder.price >= sellOrder.price) {
            return buyOrder;
        }
    }

    return null;
}

export default limit