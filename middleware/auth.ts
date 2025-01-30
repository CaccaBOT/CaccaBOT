import { FastifyReply, FastifyRequest } from 'fastify'
import { getUserByToken } from '../database'
import { RawUser } from '../types/User'

export async function authenticate(req: FastifyRequest, res: FastifyReply): Promise<RawUser> {
	const token = req.headers['x-auth-token'] as string

	if (!token) {
		res.code(401).send({ error: 'No token was provided (X-Auth-Token header)' })
	}

	const user = getUserByToken(token)

	if (!user) {
		res.code(401).send({ error: 'Invalid token' })
	}

	return user
}
