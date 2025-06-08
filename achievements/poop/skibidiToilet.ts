import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const skibidiToilet: AchievementCheckerFunction = {
  id: 'SKIBIDI_TOILET',
  check: function (poop: Poop, user: RawUser) {
    const hour = moment.tz(poop.timestamp, timezone).hour()
    const minute = moment.tz(poop.timestamp, timezone).minute()
    if ((hour == 3 && minute <= 5) || (hour == 2 && minute >= 55)) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default skibidiToilet
