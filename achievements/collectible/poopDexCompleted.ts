//@ts-ignore
import { getAllCollectibles, getUserCollectibles, addAchievementToUser } from '../../database'
import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'

const poopDexCompleted: Achievement = {
	id: 'POOPDEX_COMPLETED',
	check: function (collectible: CollectibleResponse, user: RawUser) {
		const collectibles = getAllCollectibles()
		const user_collectibles = getUserCollectibles(user.id)
		if (user_collectibles.length == collectibles.length) {
			addAchievementToUser(user.id, this.id)
		}
	},
}

export default poopDexCompleted;
