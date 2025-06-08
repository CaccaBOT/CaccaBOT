import { addAchievementToUser, getAchievement } from '../../database'

import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const poopatic: AchievementCheckerFunction = {
  id: 'POOPATIC',
  check: function (collectible: CollectibleResponse, user: RawUser) {
    if (user.openedPacks >= 50) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default poopatic
