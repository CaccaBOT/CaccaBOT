import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { poopLeaderboardWithFilter } from '../../database'

interface Params {
	year: number
	month: number
}

const leaderboardFilterEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/leaderboard/:year/:month',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const { year, month } = req.params
			let leaderboard = poopLeaderboardWithFilter(year, month)
			leaderboard.forEach((x: any) => {
				delete x.phone
			})
			res.code(200).send(leaderboard)
		},
	)
}

export default leaderboardFilterEndpoint
