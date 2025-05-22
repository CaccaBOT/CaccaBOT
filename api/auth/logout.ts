import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { logout } from '../../database/index'

interface LogoutBody {
  token: string
}

const logoutEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.post(
    '/logout',
    async (req: FastifyRequest<{ Body: LogoutBody }>, res: FastifyReply) => {
      const { token } = req.body
      logout(token)
      res.code(200).send()
    }
  )
}

export default logoutEndpoint
