import {
  poopLeaderboardWithFilter,
  addAchievementToUser,
  getAchievement
} from '../../database'
import moment from 'moment-timezone'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'

import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const fastAndFecious: AchievementCheckerFunction = {
  id: 'FAST_AND_FECIOUS',
  check: function (poop: Poop, user: RawUser) {
    const year = moment().tz(timezone).year()
    const month = moment().tz(timezone).month() + 1
    const leaderboard = poopLeaderboardWithFilter(year, month)
    if (leaderboard.length == 1) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

export default fastAndFecious
