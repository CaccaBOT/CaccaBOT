import {
  addAchievementToUser,
  getUserCollectibles,
  getAllCollectibles,
  getAchievement
} from '../../database'

import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const poopSommelier: AchievementCheckerFunction = {
  id: 'POOP_SOMMELIER',
  check: function (collectible: CollectibleResponse, user: RawUser) {
    const collectibles = getAllCollectibles()
    const user_collectibles = getUserCollectibles(user.id)
    if (user_collectibles.length >= collectibles.length / 2) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default poopSommelier
