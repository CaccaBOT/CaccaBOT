import {
  setMoney,
  getRarities,
  getCollectiblesOfRarity,
  addCollectibleToUser,
  addOpenedPack
} from '../../database'
import { authenticate } from '../../middleware/auth'
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { CollectibleActionEnum } from '../../types/events/CollectibleActionEnum'

const openPackEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
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
    const collectiblesOfRarity = getCollectiblesOfRarity(rarity.id)
    const collectible =
      collectiblesOfRarity[
        Math.floor(Math.random() * collectiblesOfRarity.length)
      ]
    const newOwnership = addCollectibleToUser(user.id, collectible.id)
    addOpenedPack(user.id)

    // emit the pack opening event
    events.emit(EventTypeEnum.COLLECTIBLE, {
      action: CollectibleActionEnum.OPEN_PACK,
      user,
      collectibles: [newOwnership]
    })

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
