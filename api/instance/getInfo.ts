import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { version } from '../../package.json'
import { config } from '../../config/loader'

const getInstanceInfoEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/info', async (req: FastifyRequest, res: FastifyReply) => {
		res.code(200).send({
			name: config.name,
			description: config.description,
			version: `v${version}`,
		})
	})
}

export default getInstanceInfoEndpoint
