import { setMoney, getRarities, getCollectibles, addCollectibleToUser, checkAchievementForUser, addOpenedPack } from '../../database'
import { authenticate } from '../../middleware/auth'
import { client } from '../../whatsapp/index'
import config from '../../config.json'
import { MessageMedia } from 'whatsapp-web.js'
import path from 'path'
import fs from 'fs'
import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'

const openPackEndpoint = async function (server: FastifyInstance, options: RouteOptions) {
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
		checkPackAchievements(collectible, user)
		res.code(200).send(collectible)
	})
}

function checkPackAchievements(collectible: CollectibleResponse, user: RawUser) {
	const achievementsDir = path.resolve(
		`${__dirname}/../../achievements/collectible`,
	)
	fs.readdirSync(achievementsDir).forEach(async (file) => {
		const achievementModule = await import(`${achievementsDir}/${file}`)
		const achievement = achievementModule.default
		if (!checkAchievementForUser(user.id, achievement.id)) {
			achievement.check(collectible, user)
		}
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

export default openPackEndpoint;
