import { addAchievementToUser } from '../../database'
import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser, User } from '../../types/User'

const notEverythingThatShinesIsGold: Achievement = {
	id: 'NOT_EVERYTHING_THAT_SHINES_IS_GOLD',
	check: function (collectible: CollectibleResponse, user: RawUser) {
		if (collectible.rarity == 'Sensazianale') {
			addAchievementToUser(user.id, this.id)
		}
	},
}

export default notEverythingThatShinesIsGold
