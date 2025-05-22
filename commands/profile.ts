import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import {
  updateUsername,
  updateProfilePicture,
  updateBio,
  getUserProfileByPhone,
  getUserProfileByUsername,
  isUsernameAvailable
} from '../database/index'
import achievementChecker from '../achievements/check'
import UsernameValidator from '../validators/username'

const profile: Command = {
  name: 'profile',
  description: 'manage your profile',
  execute: async (message: Message, info: Info) => {
    const user = getUserProfileByPhone(message.author!)
    if (!user.id) {
      message.reply(
        `❌ You don't have a poop profile.\nIt'll be automatically created when you poop the first time`
      )
      return
    }

    switch (info.args[0]) {
      case 'pic':
        let pic = info.args[1]
        updateProfilePicture(user.id, pic)
        break
      case 'username':
        let username = info.args[1]
        if (!isUsernameAvailable(username)) {
          message.reply('❌ Username not available')
          return
        }
        if (!UsernameValidator.validate(username)) {
          message.reply('❌ Username not valid')
          return
        }
        updateUsername(user.id, username)
        break
      case 'bio':
        let bio = info.args.join(' ')
        bio = bio.substring(3, bio.length)
        updateBio(user.id, bio)
        break
      default:
        message.reply('❌ Invalid argument\nAvailable: pic, username, bio')
        return
    }
    achievementChecker.checkActionBased(user)
    message.reply('✅ Saved')
  }
}

export default profile
