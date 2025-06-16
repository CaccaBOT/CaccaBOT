import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { authenticate } from "../../../middleware/auth"
import { getHintsOfUser } from "../../../database"
import { Hint } from "../../../types/Hint"
import { encryptRiddlePart } from "../../../utilities"

  
export const getAllHints = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/', async (req: FastifyRequest<{}>, res: FastifyReply) => {
    const user = await authenticate(req, res)

    const hints = getHintsOfUser(user.id)

    hints.forEach(hint => {
      hint.riddle_part_id = encryptRiddlePart(hint.riddle_part_id, user.id)
    })

    res.code(200).send(hints)
  })
}
  
export default getAllHints