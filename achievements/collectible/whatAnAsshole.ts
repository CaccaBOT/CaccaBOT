import { addAchievementToUser } from '../../database'
import { Achievement } from '../../types/Achievement'
import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'

const whatAnAsshole: Achievement = {
  id: 'WHAT_AN_ASSHOLE',
  check: function (collectible: CollectibleResponse, user: RawUser) {
    if (collectible.rarity == 'Caccasmagorico') {
      addAchievementToUser(user.id, this.id)
    }
  }
}

export default whatAnAsshole
