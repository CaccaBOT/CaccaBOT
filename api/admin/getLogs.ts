import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { authenticate } from '../../middleware/auth'
import fs from 'fs'
import moment from 'moment'
import { config } from '../../config/loader'
import path from 'path'

const getLogsEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/logs',
    async (req: FastifyRequest, res: FastifyReply) => {
      const user = await authenticate(req, res)

      if (!user.admin) {
        res.code(403).send({ error: 'You are not an admin' })
        return
      }

      const file = `../../logs/${moment().tz(config.timezone).format('YYYY-MM-DD')}.log`

      const logs = fs.readFileSync(path.join(__dirname, file), 'utf8')
      res.code(200).send(logs)
    }
  )
}

export default getLogsEndpoint
