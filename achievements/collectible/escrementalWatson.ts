import { CollectibleResponse } from '../../types/CollectibleResponse'
import { RawUser } from '../../types/User'
import { addAchievementToUser, getAchievement } from '../../database'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const escrementalWatson: AchievementCheckerFunction = {
  id: 'ESCREMENTAL_WATSON',
  check: function (collectible: CollectibleResponse, user: RawUser) {
    if (collectible.rarity == 'Escrementale') {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default escrementalWatson
