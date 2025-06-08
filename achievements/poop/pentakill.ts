import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import {
  poopStatsFromUser,
  addAchievementToUser,
  getAchievement
} from '../../database'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const pentakill: AchievementCheckerFunction = {
  id: 'PENTAKILL',
  check: function (poop: Poop, user: RawUser) {
    const stats = poopStatsFromUser(user.id)
    if (stats.today >= 5) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default pentakill
