import { addAchievementToUser, getAchievement } from '../../database'

import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const notEverythingThatShinesIsGold: AchievementCheckerFunction = {
  id: 'NOT_EVERYTHING_THAT_SHINES_IS_GOLD',
  check: function (collectible: CollectibleResponse, user: RawUser) {
    if (collectible.rarity == 'Sensazianale') {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default notEverythingThatShinesIsGold
