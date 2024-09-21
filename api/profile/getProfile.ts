import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { getUserProfileById } from '../../database'

interface Params {
	id: string,
	year: number,
	month: number
}

const getProfileEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.get('/:id', async (req: FastifyRequest<{Params: Params}>, res: FastifyReply) => {
		const id = req.params['id']
		let user = getUserProfileById(id)
		if (user) {
			delete user.token
			delete user.password
			delete user.phone
			res.code(200).send(user)
		} else {
			res.code(404).send()
		}
	})
}

export default getProfileEndpoint;