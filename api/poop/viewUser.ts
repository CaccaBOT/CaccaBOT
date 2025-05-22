import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { getPoopsFromUser } from '../../database/index'

interface Params {
  id: string
}

const viewUserEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/user/:id',
    async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
      let id = req.params.id
      res.code(200).send(getPoopsFromUser(id))
    }
  )
}

export default viewUserEndpoint
