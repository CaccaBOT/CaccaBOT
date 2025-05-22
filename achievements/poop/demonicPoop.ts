import { Message } from 'whatsapp-web.js'
import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Achievement } from '../../types/Achievement'

const demonicPoop: Achievement = {
  id: 'DEMONIC_POOP',
  check: function (poop: Poop, user: RawUser, message: Message) {
    if (user.money == 666) {
      addAchievementToUser(user.id, this.id)
      const achievement = getAchievement(this.id)
      message.reply(
        `*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`
      )
    }
  }
}

export default demonicPoop
