import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { login } from '../../database/index'

interface LoginBody {
  username: string
  password: string
}

const loginEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.post(
    '/login',
    async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
      const { username, password } = req.body
      const user = await login(username, password)
      if (!user) {
        res.code(401).send({ error: 'Invalid credentials' })
        return
      }

      delete user.password
      delete user.phone

      res.code(200).send(user)
    }
  )
}

export default loginEndpoint
