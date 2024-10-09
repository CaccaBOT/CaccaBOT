import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import config from '../../config.json'

const getVersionEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/version', async (req: FastifyRequest, res: FastifyReply) => {
		res.code(200).send({ version: config.version })
	})
}

export default getVersionEndpoint
