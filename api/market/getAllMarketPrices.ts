import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { getAllCollectibles } from '../../database'
import MarketLogic from '../../market'
import { MarketDay } from '../../types/MarketDay'

export const getAllMarketPricesEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/price', async (req: FastifyRequest<{}>, res: FastifyReply) => {
    const date = new Date()
    const collectibles = getAllCollectibles()
    const result: MarketDay[] = []

    for (const collectible of collectibles) {
      result.push({
        collectibleId: collectible.id,
        price: MarketLogic.getMarketPrice(collectible.id, date),
        dailyVariation: MarketLogic.getDailyVariation(collectible.id, date)
      })
    }

    res.code(200).send(result)
  })
}

export default getAllMarketPricesEndpoint
