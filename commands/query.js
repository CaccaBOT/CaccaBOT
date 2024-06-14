const { rawQuery } = require('../database')

module.exports = {
	name: 'query',
	description: 'execute a raw SQL query on the database',
	execute: async (message, info) => {
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
