import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { authenticate } from "../../../middleware/auth"
import { addHint, getRiddlePart } from "../../../database"
import { decryptRiddlePart } from "../../../utilities"

interface HintBody {
  encrypted: string
}

export const unlockHints = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.post('/', async (req: FastifyRequest<{ Body: HintBody }>, res: FastifyReply) => {
    const encrypted = req.body.encrypted
    const user = await authenticate(req, res)

    console.log(encrypted)
    console.log(user.id)

    const riddlePartId = decryptRiddlePart(encrypted, user.id)
    
    if (!riddlePartId) {
        res.code(400).send({
            message: "Invalid encrypted data"
        })
        return
    }
    
    const riddlePart = getRiddlePart(riddlePartId)
    
    if (!riddlePart) {
        res.code(400).send({
            message: "Invalid riddle part id"
        })
        return
    }
    
    addHint(user.id, riddlePartId)
  })
}
  
export default unlockHints