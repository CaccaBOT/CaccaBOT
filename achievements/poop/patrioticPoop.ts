import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database/'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'

import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const patrioticPoop: AchievementCheckerFunction = {
  id: 'PATRIOTIC_POOP',
  check: function (poop: Poop, user: RawUser) {
    const month = moment.tz(poop.timestamp, timezone).month() + 1
    const day = moment.tz(poop.timestamp, timezone).date()
    if (month == 6 && day == 2) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default patrioticPoop
