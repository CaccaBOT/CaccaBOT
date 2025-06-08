import { checkAchievementForUser } from '../database'
import { Poop } from '../types/Poop'
import { RawUser } from '../types/User'
import fs from 'fs'
import path from 'path'
import { Collectible } from '../types/Collectible'

const AchievementChecker = {
  checkActionBased(user: RawUser) {
    const achievementsDir = path.resolve(`${__dirname}/action`)
    fs.readdirSync(achievementsDir).forEach(async (file) => {
      const achievementModule = await import(`${achievementsDir}/${file}`)
      const achievement = achievementModule.default
      if (!checkAchievementForUser(user.id, achievement.id)) {
        achievement.check(user)
      }
    })
  },

  checkPoopBased(user: RawUser, poop: Poop) {
    const achievementsDir = path.resolve(`${__dirname}/poop`)
    fs.readdirSync(achievementsDir).forEach(async (file) => {
      const achievementModule = await import(`${achievementsDir}/${file}`)
      const achievement = achievementModule.default
      if (!checkAchievementForUser(user.id, achievement.id)) {
        achievement.check(poop, user)
      }
    })
  },

  checkCollectibleBased(user: RawUser, collectible: Collectible) {
    const achievementsDir = path.resolve(`${__dirname}/collectible`)
    fs.readdirSync(achievementsDir).forEach(async (file) => {
      const achievementModule = await import(`${achievementsDir}/${file}`)
      const achievement = achievementModule.default
      if (!checkAchievementForUser(user.id, achievement.id)) {
        achievement.check(collectible, user)
      }
    })
  }
}

export default AchievementChecker
