import {
  poopStreak,
  addAchievementToUser,
  getAchievement
} from '../../database/'
import { RawUser } from '../../types/User'
import { Poop } from '../../types/Poop'

import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const oneMonthOfShit: AchievementCheckerFunction = {
  id: 'ONE_MONTH_OF_SHIT',
  check: function (poop: Poop, user: RawUser) {
    const streak = poopStreak(user.id)
    if (streak >= 30) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default oneMonthOfShit
