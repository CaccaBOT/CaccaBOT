import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { RawUser } from "../../types/User"

import { updateProfilePicture, checkAchievementForUser } from '../../database'
import { authenticate } from '../../middleware/auth'
import fs from 'fs'
import path from 'path'

const deletePfpEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.delete('/pfp', async (req: FastifyRequest, res: FastifyReply) => {
		const user = await authenticate(req, res)
		updateProfilePicture(user.id, null)
		checkAchievements(user)
		res.code(200).send()
	})
}

function checkAchievements(user: RawUser) {
	const achievementsDir = path.resolve(`${__dirname}/../../achievements/action`)
	fs.readdirSync(achievementsDir).forEach((file) => {
		const achievement = require(`${achievementsDir}/${file}`)
		if (!checkAchievementForUser(user.id, achievement.id)) {
			achievement.check(user)
		}
	})
}

export default deletePfpEndpoint;