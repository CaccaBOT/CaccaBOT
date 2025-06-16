import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { authenticate } from "../../../middleware/auth"
import { getHintsOfUser, getHintsOfUserOfRiddle } from "../../../database"
import { encryptRiddlePart } from "../../../utilities"

interface Params {
  riddleId: string
}

export const getAllHints = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/:riddleId', async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
    const riddleId = Number.parseInt(req.params.riddleId)
    const user = await authenticate(req, res)

    const hints = getHintsOfUserOfRiddle(user.id, riddleId)

    hints.forEach(hint => {
      hint.riddle_part_id = encryptRiddlePart(hint.riddle_part_id, user.id)
    })

    res.code(200).send(hints)
  })
}
  
export default getAllHints