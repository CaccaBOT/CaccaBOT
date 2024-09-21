import { addAchievementToUser } from '../../database'
import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'

const theFirstOfALongTime: Achievement = {
	id: 'THE_FIRST_OF_A_LONG_TIME',
	check: function (collectible: CollectibleResponse, user: RawUser) {
		addAchievementToUser(user.id, this.id)
	},
}

export default theFirstOfALongTime