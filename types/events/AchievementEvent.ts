import { Achievement } from '../Achievement'
import { RawUser } from '../User'

export type AchievementEvent = {
  achievement: Achievement
  user: RawUser
}
