import { Message } from 'whatsapp-web.js'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Achievement } from '../../types/Achievement'
import { config } from '../../config/loader'

const timezone = config.timezone || 'UTC'

const smokePoopEveryday: Achievement = {
  id: 'SMOKE_POOP_EVERYDAY',
  check: function (poop: Poop, user: RawUser, message: Message) {
    const hour = moment.tz(poop.timestamp, timezone).hour()
    const minute = moment.tz(poop.timestamp, timezone).minute()
    if (hour == 4 && minute == 20) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      message.reply(
        `*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`
      )
    }
  }
}

export default smokePoopEveryday
