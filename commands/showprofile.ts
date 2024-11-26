import { Command, Info } from '../types/Command'
import { getUserProfileByUsername } from '../database/index'
import { Message } from 'whatsapp-web.js'

const showprofile: Command = {
	name: 'showprofile',
	description: 'view the profile of a user',
	execute: async (message: Message, info: Info) => {
		if (!info.args[0]) {
			message.reply('❌ Please provide a username')
			return
		}

		const username = info.args[0]
		const user = getUserProfileByUsername(username)

		if (!user.id) {
			message.reply('❌ User does not exist')
			return
		}

		message.reply(
			'*ID*: ' +
				user.id +
				'\n' +
				'*Username*: ' +
				user.username +
				'\n' +
				'*Bio*: ' +
				(user.bio ?? 'N/A') +
				'\n' +
				'*Frozen*: ' +
				(user.frozen == 0 ? 'No' : 'Yes') +
				'\n' +
				'*Poops*: ' +
				user.poops +
				'\n' +
				'*Merdollars*: ' +
				user.money,
		)
	},
}

export default showprofile
