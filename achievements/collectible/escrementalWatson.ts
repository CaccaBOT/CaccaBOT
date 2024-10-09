import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'
import { addAchievementToUser } from '../../database'

const escrementalWatson: Achievement = {
	id: 'ESCREMENTAL_WATSON',
	check: function (collectible: CollectibleResponse, user: RawUser) {
		if (collectible.rarity == 'Escrementale') {
			addAchievementToUser(user.id, this.id)
		}
	},
}

export default escrementalWatson
