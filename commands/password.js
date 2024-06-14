const { updatePassword, getUserProfileByPhone } = require('../database/index')
const crypto = require('crypto')
const { client } = require('../whatsapp/index')
const config = require('../config.json')

module.exports = {
	name: 'password',
	description: 'change your password',
	execute: async (message, info) => {
		const user = getUserProfileByPhone(message.author)
		if (!user.id) {
			message.reply(
				`❌ You don't have a poop profile.\nIt'll be automatically created when you poop the first time`,
			)
			return
		}

		const password = crypto.randomBytes(10).toString('hex')
		updatePassword(user.id, password)
		client.sendMessage(
			message.author,
			`Your CaccaBOT password is: ${password}\nRemember to change it as soon as possible\n${config.frontendUrl}`,
		)
	},
}
