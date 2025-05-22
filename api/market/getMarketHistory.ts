import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { getCollectible, getHistoricalMarketDays } from '../../database'

interface Params {
  collectibleId: string
}

const getMarketHistoryEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/history/:collectibleId',
    async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
      const collectibleId = Number.parseInt(req.params.collectibleId)

      if (!getCollectible(collectibleId)) {
        res.code(404).send({
          error: "The collectible doesn't exist."
        })
        return
      }

      const historicalMarketDays = getHistoricalMarketDays(collectibleId)

      res.code(200).send(historicalMarketDays)
    }
  )
}

export default getMarketHistoryEndpoint
