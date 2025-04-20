import { addAchievementToUser } from '../../database'
import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'
import { whatsappClient } from '../../whatsapp'

const iSaidTheyAreShits: Achievement = {
	id: 'I_SAID_THEY_ARE_SHITS',
	check: function (collectible: CollectibleResponse, user: RawUser) {
		if (collectible.rarity == 'Merdume') {
			addAchievementToUser(user.id, this.id)
		}
	},
}

export default iSaidTheyAreShits
