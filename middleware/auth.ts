import { FastifyReply, FastifyRequest } from 'fastify'
import { getUserByToken } from '../database'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
	const token = req.headers['x-auth-token'] as string

	if (!token) {
		res.code(401).send({ error: 'No token was provided (X-Auth-Token header)' })
		return null
	}

	const user = getUserByToken(token)

	if (!user) {
		res.code(401).send({ error: 'Invalid token' })
		return null
	}

	return user
}
