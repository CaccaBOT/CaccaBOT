import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import poopValidator from '../validators/poop'
import {
	addPoopWithTimestamp,
	getLastPoop,
	hashId,
	poopStatsFromUserWithFilter,
} from '../database'
import { client } from '../whatsapp'
import moment from 'moment'

const help: Command = {
	name: 'compute',
	description: 'compute the poop insertion message',
	execute: async (message: Message, info: Info) => {
		if (!message.id.fromMe) {
			message.reply("❌ You're not allowed to compute a message")
			return
		}

		let poopMessage = await message.getQuotedMessage()

		if (poopMessage == null) {
			message.reply('❌ You must quote a message for this command')
			return
		}

		let messages = await (
			await client.getChatById((await poopMessage.getChat()).id._serialized)
		).fetchMessages({ limit: parseInt(info.args[0]) ?? 100 })
		let match = messages.find(
			(m) => m.id._serialized == poopMessage.id._serialized,
		)

		if (match) {
			poopMessage = match
		}

		if (!poopMessage.timestamp) {
			message.reply('❌ Cannot fetch message timestamp')
			return
		}

		if (poopValidator.validate(poopMessage.body)) {
			const number = (await poopMessage.getContact()).number
			const id = hashId(number)
			addPoopWithTimestamp(
				id,
				new Date(poopMessage.timestamp * 1000).toISOString(),
			)
			const stats = poopStatsFromUserWithFilter(
				id,
				moment().year(),
				moment().month() + 1,
			)
			const poop = getLastPoop()
			poopMessage.reply(
				'✅ Saved' +
					'\nID: ' +
					poop.id +
					'\nTimestamp: ' +
					poop.timestamp +
					'\nRank: ' +
					stats.monthlyLeaderboardPosition +
					'°' +
					'\nStreak: ' +
					stats.streak +
					'\nDaily AVG: ' +
					stats.poopAverage +
					'\nMonthly: ' +
					stats.monthlyPoops,
			)
		}
	},
}

export default help
