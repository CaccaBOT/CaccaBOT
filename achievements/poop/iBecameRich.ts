import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const iBecameRich: AchievementCheckerFunction = {
  id: 'I_BECAME_RICH',
  check: function (poop: Poop, user: RawUser) {
    addAchievementToUser(user.id, this.id)
    const achievement = getAchievement(this.id)
    events.emit(EventTypeEnum.ACHIEVEMENT, {
      user,
      achievement
    })
  }
}

export default iBecameRich
