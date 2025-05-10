import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import {
	getAllCollectibles,
	getCollectible,
	getCollectibleOwnerships,
} from '../../database'
import MarketLogic from '../../market'
import { MarketDays } from '../../types/MarketDay'

const getMarketHistoriesEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/price', async (req: FastifyRequest<{}>, res: FastifyReply) => {
		const date = new Date()
		const collectibles = getAllCollectibles()
		const result: MarketDays = {}

		for (const collectible of collectibles) {
			result[collectible.id] = {
				marketPrice: MarketLogic.getMarketPrice(collectible.id, date),
				dailyVariation: MarketLogic.getDailyVariation(collectible.id, date),
			}
		}

		res.code(200).send(result)
	})
}

export default getMarketHistoriesEndpoint
