import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import { getCollectible } from '../../database'
import marketLogic from '../../market'

interface Params {
	collectibleId: string
}

const getMarketPriceEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/price/:collectibleId',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const collectibleId = Number.parseInt(req.params.collectibleId)

			// Input validation

			if (!getCollectible(collectibleId)) {
				res.code(404).send({
					error: "The collectible doesn't exist.",
				})
				return
			}

			// Logic

			res.code(200).send({
                marketPrice: marketLogic.getMarketPrice(collectibleId),
            })
		},
	)
}

export default getMarketPriceEndpoint