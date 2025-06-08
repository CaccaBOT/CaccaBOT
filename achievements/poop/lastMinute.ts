import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'

import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const lastMinute: AchievementCheckerFunction = {
  id: 'LAST_MINUTE',
  check: function (poop: Poop, user: RawUser) {
    const date = moment.tz(poop.timestamp, timezone)
    const lastSecondOfMonth = moment.tz(date, timezone).endOf('month')
    const lastMinuteOfMonth = moment
      .tz(lastSecondOfMonth, timezone)
      .subtract(59, 'seconds')
    if (date.isBetween(lastMinuteOfMonth, lastSecondOfMonth, null, '[]')) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default lastMinute
