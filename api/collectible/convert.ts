import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import {
  deleteUserCollectible,
  getCollectiblesOfRarity,
  addCollectibleToUser,
  getAllCollectibles,
  getRarities,
  getCollectibleOwnershipsNotSelling
} from '../../database'
import { authenticate } from '../../middleware/auth'
import achievementChecker from '../../achievements/check'
import { config } from '../../config/loader'
import { MessageMedia } from 'whatsapp-web.js'
import { whatsappClient } from '../../whatsapp'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { CollectibleActionEnum } from '../../types/events/CollectibleActionEnum'

interface ConvertBody {
  collectibles: number[]
}

const convertEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.post(
    '/convert',
    async (req: FastifyRequest<{ Body: ConvertBody }>, res: FastifyReply) => {
      const user = await authenticate(req, res)
      const collectiblesToConvert = req.body.collectibles
      const allCollectibles = getAllCollectibles()
      const collectibleOwnerships = getCollectibleOwnershipsNotSelling(user.id)

      // check for quantity
      if (collectiblesToConvert.length != 10) {
        return res.code(400).send({
          error: 'You need 10 collectibles to convert to a higher rarity'
        })
      }

      // check for ownership
      for (const c of collectiblesToConvert) {
        const idCount = collectiblesToConvert.filter((id) => id === c).length
        const ownershipCount = collectibleOwnerships.filter(
          (co) => co.collectible_id === c
        ).length
        if (idCount > ownershipCount) {
          return res.code(400).send({
            error:
              'You do not own all the collectibles you are trying to convert'
          })
        }
      }

      // build the collectible object from the collectible ids
      const collectibles = collectiblesToConvert.map((c) =>
        allCollectibles.find((ac) => ac.id === c)
      )

      // check for rarity
      if (!collectibles[0]) {
        return res.code(400).send({ error: 'Invalid collectible data' })
      }

      const rarity = collectibles[0].rarity_id

      if (rarity === 4) {
        return res
          .code(400)
          .send({ error: 'You cannot convert a collectible with this rarity' })
      }

      if (collectibles.some((c) => c && c.rarity_id !== rarity)) {
        return res.code(400).send({
          error: 'You cannot convert collectibles of different rarities'
        })
      }

      // delete the collectible ownerships
      collectiblesToConvert.forEach((c) => {
        const ownership = collectibleOwnerships.find(
          (co) => co.collectible_id === c
        )?.id
        collectibleOwnerships.splice(
          collectibleOwnerships.findIndex((co) => co.collectible_id === c),
          1
        )
        if (!ownership) {
          return res.code(400).send({ error: 'Invalid collectible data' })
        }
        deleteUserCollectible(ownership)
      })

      // create the new collectible
      const collectiblesOfRarity = getCollectiblesOfRarity(rarity + 1)
      const collectible =
        collectiblesOfRarity[
          Math.floor(Math.random() * collectiblesOfRarity.length)
        ]

      // broadcast the new collectible to the group chat
      if (config.whatsappModuleEnabled) {
        const rarities = getRarities()
        const media = await MessageMedia.fromUrl(collectible.asset_url)
        whatsappClient.sendMessage(config.groupId, media, {
          caption: `*[CONVERT] ${user.username}* found *${collectible.name}* (${rarities[collectible.rarity_id - 1].name})`
        })
      }

      achievementChecker.checkCollectibleBased(user, collectible)
      const newOwnership = addCollectibleToUser(user.id, collectible.id)

      // emit the conversion event
      events.emit(EventTypeEnum.COLLECTIBLE, {
        action: CollectibleActionEnum.CONVERT,
        user,
        collectibles: [newOwnership]
      })

      res.code(200).send(collectible)
    }
  )
}

export default convertEndpoint
