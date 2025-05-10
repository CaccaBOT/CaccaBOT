import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import { deletePoop } from '../../database'
import { authenticate } from '../../middleware/auth'
import { whatsappClient } from '../../whatsapp'
import { config } from '../../config/loader'

interface Params {
	id: string
}

const deletePoopEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.delete(
		'/poop/:id',
		async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply) => {
			const user = await authenticate(req, res)

			if (!user.admin) {
				res.code(403).send({ error: 'You are not an admin' })
				return
			}

			const id = parseInt(req.params['id'])
			res.code(200).send(deletePoop(id))

			if (config.whatsappModuleEnabled) {
				whatsappClient.sendMessage(
					config.groupId,
					`*[ADMIN]* ${user.username} deleted poop #${id}`,
				)
			}
		},
	)
}

export default deletePoopEndpoint
