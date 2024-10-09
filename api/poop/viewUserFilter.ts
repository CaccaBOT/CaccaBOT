import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { getPoopsFromUserWithFilter } from '../../database/index'

interface Params {
	id: string
	year: number
	month: number
}

const viewUserFilterEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/:id/:year/:month',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const { id, year, month } = req.params
			res.code(200).send(getPoopsFromUserWithFilter(id, year, month))
		},
	)
}

export default viewUserFilterEndpoint
