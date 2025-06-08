import { addAchievementToUser, getAchievement } from '../../database'

import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const whatAnAsshole: AchievementCheckerFunction = {
  id: 'WHAT_AN_ASSHOLE',
  check: function (collectible: CollectibleResponse, user: RawUser) {
    if (collectible.rarity == 'Caccasmagorico') {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default whatAnAsshole
