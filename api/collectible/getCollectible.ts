import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { getCollectible } from '../../database'

interface Params {
  id: string
}

const getCollectibleEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/:id',
    async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
      const id = parseInt(req.params['id'])
      res.code(200).send(getCollectible(id))
    }
  )
}

export default getCollectibleEndpoint
