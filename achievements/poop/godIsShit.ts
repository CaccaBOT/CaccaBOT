import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'

import { config } from '../../config/loader'
import { events } from '../../middleware/events'
import { EventTypeEnum } from '../../types/events/EventType'
import { AchievementCheckerFunction } from '../../types/AchievementCheckerFunction'

const timezone = config.timezone

const godIsShit: AchievementCheckerFunction = {
  id: 'GOD_IS_SHIT',
  check: function (poop: Poop, user: RawUser) {
    const timestamp = [
      moment.tz(poop.timestamp, timezone).month() + 1,
      moment.tz(poop.timestamp, timezone).date()
    ]
    const easter = getEaster(moment.tz(poop.timestamp, timezone).year())
    if (timestamp[0] == easter[0] && timestamp[1] == easter[1]) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      events.emit(EventTypeEnum.ACHIEVEMENT, {
        user,
        achievement
      })
    }
  }
}

function getEaster(year: number) {
  let f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4)

  return [month, day]
}

export default godIsShit
