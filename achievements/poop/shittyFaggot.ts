import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const shittyFaggot: AchievementCheckerFunction = {
  id: 'SHITTY_FAGGOT',
  check: function (poop: Poop, user: RawUser) {
    const month = moment().tz(timezone).month() + 1
    if (month == 6) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default shittyFaggot
