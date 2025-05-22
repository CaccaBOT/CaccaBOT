import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { getUserProfileByUsername } from '../../database'

interface Query {
  username: string
}

const searchProfileEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/search',
    async (req: FastifyRequest<{ Querystring: Query }>, res: FastifyReply) => {
      const username = req.query['username']
      let user = getUserProfileByUsername(username)
      if (user) {
        delete user.token
        delete user.password
        delete user.phone
        res.code(200).send(user)
      } else {
        res.code(404).send()
      }
    }
  )
}

export default searchProfileEndpoint
