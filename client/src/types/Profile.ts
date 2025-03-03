export type Profile = {
  id: string
  username: string
  bio: string | null
  pfp: string | null
  poops: number
  frozen: boolean
  money: number
  admin: boolean
}

export type Poop = {
  id: number
  timestamp: string
  user_id: string
}
