import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { authenticate } from '../../middleware/auth'

const getOwnEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/', async (req: FastifyRequest, res: FastifyReply) => {
    const user = await authenticate(req, res)
    if (user) {
      delete user.token
      res.code(200).send(user)
    } else {
      res.code(404).send()
    }
  })
}

export default getOwnEndpoint
