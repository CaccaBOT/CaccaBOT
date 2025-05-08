import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import {
	getAllCollectibles
} from '../../database'
import MarketLogic from '../../market'
import { MarketDay } from '../../types/MarketDay'

interface Params {
	collectibleId: string
}

export const getMarketPriceEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/price/:collectibleId', async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
		const collectibleId = Number.parseInt(req.params.collectibleId)

		res.code(200).send({
			collectibleId: collectibleId,
			marketPrice: MarketLogic.getMarketPrice(collectibleId, new Date()),
			dailyVariation: MarketLogic.getDailyVariation(collectibleId, new Date())
		})
	})
}

export default getMarketPriceEndpoint
