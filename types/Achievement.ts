import { Message } from 'whatsapp-web.js'
import { Poop } from './Poop'
import { RawUser } from './User'
import { CollectibleResponse } from './CollectibleResponse'

export type Achievement =
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
			check: (poop: Poop, user: RawUser, message: Message) => void
	  }
