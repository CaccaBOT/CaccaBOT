import { Poop } from './Poop'
import { RawUser } from './User'
import { CollectibleResponse } from './CollectibleResponse'

export type AchievementCheckerFunction =
  | {
      id: string
      check: (user: RawUser) => void
    }
  | {
      id: string
      check: (collectible: CollectibleResponse, user: RawUser) => void
    }
  | {
      id: string
      check: (poop: Poop, user: RawUser) => void
    }
