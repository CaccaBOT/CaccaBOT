import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import {
  poopStreak,
  addAchievementToUser,
  getAchievement
} from '../../database'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const scatLover: AchievementCheckerFunction = {
  id: 'SCAT_LOVER',
  check: function (poop: Poop, user: RawUser) {
    const streak = poopStreak(user.id)
    if (streak >= 69) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default scatLover
