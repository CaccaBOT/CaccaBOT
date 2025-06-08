import { addAchievementToUser, getAchievement } from '../../database'
import { events } from '../../middleware/events'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'
import { EventTypeEnum } from '../../types/events/EventType'

import { RawUser } from '../../types/User'

const caccastomizer: AchievementCheckerFunction = {
  id: 'CACCASTOMIZER',
  check: function (user: RawUser) {
    addAchievementToUser(user.id, this.id)
    const achievement = getAchievement(this.id)
    events.emit(EventTypeEnum.ACHIEVEMENT, {
      user,
      achievement
    })
  }
}

export default caccastomizer
