export type Session = {
  id: string
  username: string
  bio: string | null
  pfp: string | null
  poops: number
  token: string
  frozen: boolean
  money: number
  admin: boolean
  discordId: string | null
}
