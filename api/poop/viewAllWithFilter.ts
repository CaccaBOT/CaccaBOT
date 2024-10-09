import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { allPoopWithFilter } from '../../database/index'

interface Params {
	year: number
	month: number
}

const viewAllWithFilterEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/all/:year/:month',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const { year, month } = req.params
			res.code(200).send(allPoopWithFilter(year, month))
		},
	)
}

export default viewAllWithFilterEndpoint
