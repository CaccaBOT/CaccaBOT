import { Message } from 'whatsapp-web.js'
import {
  poopStreak,
  addAchievementToUser,
  getAchievement
} from '../../database/'
import { RawUser } from '../../types/User'
import { Poop } from '../../types/Poop'
import { Achievement } from '../../types/Achievement'

const oneMonthOfShit: Achievement = {
  id: 'ONE_MONTH_OF_SHIT',
  check: function (poop: Poop, user: RawUser, message: Message) {
    const streak = poopStreak(user.id)
    if (streak >= 30) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      message.reply(
        `*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`
      )
    }
  }
}

export default oneMonthOfShit
