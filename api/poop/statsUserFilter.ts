import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { poopStatsFromUserWithFilter } from '../../database/index'

interface Params {
  id: string
  year: number
  month: number
}

const statsUserFilterEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/stats/:id/:year/:month',
    async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
      const { id, year, month } = req.params
      res.code(200).send(poopStatsFromUserWithFilter(id, year, month))
    }
  )
}

export default statsUserFilterEndpoint
