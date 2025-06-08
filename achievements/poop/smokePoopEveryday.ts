import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const smokePoopEveryday: AchievementCheckerFunction = {
  id: 'SMOKE_POOP_EVERYDAY',
  check: function (poop: Poop, user: RawUser) {
    const hour = moment.tz(poop.timestamp, timezone).hour()
    const minute = moment.tz(poop.timestamp, timezone).minute()
    if (hour == 4 && minute == 20) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default smokePoopEveryday
