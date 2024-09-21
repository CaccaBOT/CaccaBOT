import { addAchievementToUser } from '../../database'
import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'

const poopatic: Achievement = {
	id: 'POOPATIC',
	check: function (collectible: CollectibleResponse, user: RawUser) {
		if (user.openedPacks >= 50) {
			addAchievementToUser(user.id, this.id)
		}
	},
}

export default poopatic;