import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { getPoops } from '../../database'

const getPoopsEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/poops',
    async (
      req: FastifyRequest<{ Querystring: { offset?: number } }>,
      res: FastifyReply
    ) => {
      const offset = req.query.offset ?? 0
      res.code(200).send(getPoops(50, offset))
    }
  )
}

export default getPoopsEndpoint
