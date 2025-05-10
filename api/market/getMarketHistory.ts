import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import { getCollectible } from '../../database'
import MarketLogic from '../../market'

interface Params {
	collectibleId: string
}

const getMarketHistoryEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/price/:collectibleId',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const collectibleId = Number.parseInt(req.params.collectibleId)

			if (!getCollectible(collectibleId)) {
				res.code(404).send({
					error: "The collectible doesn't exist.",
				})
				return
			}

			res.code(200).send({
				marketPrice: MarketLogic.getMarketPrice(collectibleId, new Date()),
				dailyVariation: MarketLogic.getDailyVariation(
					collectibleId,
					new Date(),
				),
			})
		},
	)
}

export default getMarketHistoryEndpoint
