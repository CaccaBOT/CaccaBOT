import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'

import { config } from '../../config/loader'
import { EventTypeEnum } from '../../types/events/EventType'
import { events } from '../../middleware/events'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const instantEffect: AchievementCheckerFunction = {
  id: 'INSTANT_EFFECT',
  check: function (poop: Poop, user: RawUser) {
    const timestamp = moment.tz(poop.timestamp, timezone).hour()
    if (timestamp >= 12 && timestamp < 14) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default instantEffect
