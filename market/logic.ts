import { getLastLimitOrderExecuted } from "../database"




const marketLogic = {
    getMarketPrice(collectibleId: number) {
        return getLastLimitOrderExecuted(collectibleId).price
    }

    

}