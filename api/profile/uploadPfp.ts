import { updateProfilePicture, checkAchievementForUser } from '../../database'
import { authenticate } from '../../middleware/auth'
import fs from 'fs'
import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import path from 'path'
import { RawUser } from '../../types/User'

interface UploadPfpBody {
	image: string,
}


const uploadPfpEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
	server.post('/pfp', async (req: FastifyRequest<{Body: UploadPfpBody}>, res: FastifyReply) => {
		const { image } = req.body
		const user = await authenticate(req, res)

		if (!image || typeof image !== 'string') {
			return res.status(400).send({ error: 'Invalid image data' })
		}

		const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)
		if (!matches || matches.length !== 3) {
			return res.status(400).send({ error: 'Invalid image format' })
		}

		const ext = matches[1]
		const base64Data = matches[2]
		const buffer = Buffer.from(base64Data, 'base64')

		const filename = `${user.id}.${ext}`
		const dirPath = path.join(__dirname, '../../public/pfp')
		const filePath = path.join(dirPath, filename)

		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true })
		}

		fs.writeFileSync(filePath, buffer)

		const imageUrl = `https://caccabot.duckdns.org/public/pfp/${filename}`
		updateProfilePicture(user.id, imageUrl)
		checkAchievements(user)
		return res.send({ url: imageUrl })
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

export default uploadPfpEndpoint;