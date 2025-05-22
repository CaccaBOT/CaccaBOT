import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { poopLeaderboard } from '../../database'

const leaderboardEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/leaderboard', async (req: FastifyRequest, res: FastifyReply) => {
    let leaderboard = poopLeaderboard()
    leaderboard.forEach((x: any) => {
      delete x.phone
    })
    res.code(200).send(leaderboard)
  })
}

export default leaderboardEndpoint
