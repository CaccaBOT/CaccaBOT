import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { getRiddles } from "../../database"

  
export const getAllRiddles = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/', async (req: FastifyRequest<{}>, res: FastifyReply) => {
    const riddles = getRiddles()

    res.code(200).send(riddles)
  })
}
  
export default getAllRiddles