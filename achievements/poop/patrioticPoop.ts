import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database/'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'
import { config } from '../../config/loader'

const timezone = config.timezone || 'UTC'

const patrioticPoop: Achievement = {
  id: 'PATRIOTIC_POOP',
  check: function (poop: Poop, user: RawUser, message: Message) {
    const month = moment.tz(poop.timestamp, timezone).month() + 1
    const day = moment.tz(poop.timestamp, timezone).date()
    if (month == 6 && day == 2) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      message.reply(
        `*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`
      )
    }
  }
}

export default patrioticPoop
