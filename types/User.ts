export type RawUser = {
  id: string
  username: string
  frozen: boolean
  token?: string | null
  pfp: string | null
  bio: string | null
  money: number
  openedPacks: number
  admin: boolean
}

export type User = {
  id: string
  username: string
  frozen: boolean
  pfp: string | null
  bio: string | null
  money: number
  openedPacks: number
  admin: boolean
}
