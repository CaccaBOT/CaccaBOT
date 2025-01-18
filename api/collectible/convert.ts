import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { deleteUserCollectible, getCollectibles, addCollectibleToUser, getAllCollectibles, getCollectibleOwnershipById } from '../../database'
import { authenticate } from '../../middleware/auth'
import { UserCollectible } from '../../types/UserCollectible'
import { Collectible } from '../../types/Collectible'

interface ConvertBody {
	collectibles: number[]
}

const convertEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.post(
		'/convert',
		async (req: FastifyRequest<{ Body: ConvertBody }>, res: FastifyReply) => {
            const user = await authenticate(req, res)
            const collectiblesToConvert = req.body.collectibles
            const allCollectibles = getAllCollectibles()

            // check for quantity
            if (collectiblesToConvert.length != 10) {
                res.code(400).send({ error: 'You need 10 cards to convert to a higher rarity' })
            }

            // check for ownership
            for (const c of collectiblesToConvert) {
                const userCollectible = getCollectibleOwnershipById(c)
                if (userCollectible.user_id !== user.id) {
                    res.code(400).send({ error: 'You do not own all the cards you are trying to convert' })
                }
            }

            // map the ids to the actual collectible ownerships
            const collectibleOwnerships = collectiblesToConvert.map((id) => {
                return getCollectibleOwnershipById(id)
            })

            const collectibles = collectibleOwnerships.map((co) => allCollectibles.find((c) => c.id === co.collectible_id))

            // check for rarity
            if (!collectibles[0]) {
                res.code(400).send({ error: 'Invalid collectible data' })
                return
            }

            const rarity = collectibles[0].rarity_id
            console.log(collectibles[0])

            if (rarity === 4) {
                res.code(400).send({ error: 'You cannot convert a card with this rarity' })
            }

            if (collectibles.some((c) => c && c.rarity_id !== rarity )) {
                res.code(400).send({ error: 'You cannot convert cards of different rarities' })
            }

            // delete the old collectibles
            for (const c of collectiblesToConvert) {
                console.log("Deleted " + c)
                //deleteUserCollectible(c)
            }

            // create the new collectible
            const collectiblesOfRarity = getCollectibles(rarity + 1)
            console.log(collectiblesOfRarity)
            const collectible = collectiblesOfRarity[Math.floor(Math.random() * collectiblesOfRarity.length)]

            console.log("Added")
            console.log(collectible)

            //addCollectibleToUser(user.id, collectible.id)
			res.code(200).send(collectible)
		},
	)
}

export default convertEndpoint
