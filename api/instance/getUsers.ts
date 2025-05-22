import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { getAllUsers } from '../../database/index'

const getInstanceInfoEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/users', async (req: FastifyRequest, res: FastifyReply) => {
    res.code(200).send(getAllUsers())
  })
}

export default getInstanceInfoEndpoint
