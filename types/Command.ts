export type Command = {
  name: string
  description: string
  execute: (message: Message, info: Info) => void
}

export type Info = {
  args: string[]
}
