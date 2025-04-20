import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import { updatePassword, getUserProfileByPhone } from '../database/index'
import crypto from 'crypto'
import { whatsappClient } from '../whatsapp/index'
import { config } from '../config/loader'

const password: Command = {
	name: 'password',
	description: 'change your password',
	execute: async (message: Message, info: Info) => {
		const user = getUserProfileByPhone(message.author!)
		if (!user.id) {
			message.reply(
				`❌ You don't have a poop profile.\nIt'll be automatically created when you poop the first time`,
			)
			return
		}

		const password = crypto.randomBytes(10).toString('hex')
		updatePassword(user.id, password)
		whatsappClient.sendMessage(
			message.author!,
			`Your CaccaBOT password is: ${password}\nRemember to change it as soon as possible\n${config.serverUrl}`,
		)
	},
}

export default password
