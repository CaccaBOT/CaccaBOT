import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const timeForASnack: AchievementCheckerFunction = {
  id: 'TIME_FOR_A_SNACK',
  check: function (poop: Poop, user: RawUser) {
    const timestamp = moment.tz(poop.timestamp, timezone).hour()
    if (timestamp >= 16 && timestamp < 18) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default timeForASnack
