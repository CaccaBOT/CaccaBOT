import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import { rawQuery } from '../database'

const query: Command = {
	name: 'query',
	description: 'execute a raw SQL query on the database',
	execute: async (message: Message, info: Info) => {
		if (message.id.fromMe) {
			try {
				message.reply(JSON.stringify(rawQuery(info.args.join(' ')), null, 2))
			} catch (e) {
				message.reply(JSON.stringify(e, Object.getOwnPropertyNames(e), 2))
			}
		} else {
			message.reply('❌ You are not allowed to perform raw SQL queries')
		}
	},
}

export default query
