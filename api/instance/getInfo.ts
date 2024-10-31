import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import config from '../../config.json'

const getInstanceInfoEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/info', async (req: FastifyRequest, res: FastifyReply) => {
		res.code(200).send({ 
			name: config.name,
			description: config.description,
			version: config.version 
		})
	})
}

export default getInstanceInfoEndpoint
