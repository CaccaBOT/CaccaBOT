import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { getAllAchievements } from '../../database'

const getAchievementsEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/', async (req: FastifyRequest, res: FastifyReply) => {
    res.code(200).send(getAllAchievements())
  })
}

export default getAchievementsEndpoint
