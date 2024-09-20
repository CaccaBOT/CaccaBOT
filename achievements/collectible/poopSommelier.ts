//@ts-ignore
import { addAchievementToUser, getUserCollectibles, getAllCollectibles } from '../../database'
import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'

const poopSommelier: Achievement = {
	id: 'POOP_SOMMELIER',
	check: function (collectible: CollectibleResponse, user: RawUser) {
		const collectibles = getAllCollectibles()
		const user_collectibles = getUserCollectibles(user.id)
		if (user_collectibles.length >= collectibles.length / 2) {
			addAchievementToUser(user.id, this.id)
		}
	},
}

export default poopSommelier;