import {
	setMoney,
	getRarities,
	getCollectibles,
	addCollectibleToUser,
	addOpenedPack,
} from '../../database'
import { authenticate } from '../../middleware/auth'
import { client } from '../../whatsapp/index'
import config from '../../config.json'
import { MessageMedia } from 'whatsapp-web.js'
import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import achievementChecker from '../../achievements/check'

const openPackEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/open', async (req: FastifyRequest, res: FastifyReply) => {
		const user = await authenticate(req, res)

		if (user.money < 5) {
			res.code(403).send({ error: "You can't afford this item" })
			return
		}

		setMoney(user.id, user.money - 5)
		const rarities = getRarities()
		const rarity = pickRarity(rarities)
		const collectiblesOfRarity = getCollectibles(rarity.id)
		const collectible =
			collectiblesOfRarity[
				Math.floor(Math.random() * collectiblesOfRarity.length)
			]
		delete collectible.rarity_id
		collectible.rarity = rarity.name
		addCollectibleToUser(user.id, collectible.id)
		addOpenedPack(user.id)
		if (config.whatsappModuleEnabled) {
			const media = await MessageMedia.fromUrl(collectible.asset_url)
			client.sendMessage(config.groupId, media, {
				caption: `*[PACK] ${user.username}* found *${collectible.name}* (${collectible.rarity})`,
			})
		}
		achievementChecker.checkCollectibleBased(collectible, user)
		res.code(200).send(collectible)
	})
}

function pickRarity(rarities: any) {
	const randomChance = Math.random() * 100
	let runningSum = 0

	for (const rarity of rarities) {
		runningSum += rarity.chance
		if (randomChance < runningSum) {
			return rarity
		}
	}
}

export default openPackEndpoint
