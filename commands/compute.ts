import { Message } from 'whatsapp-web.js'
import { Command, Info } from '../types/Command'
import poopValidator from '../validators/poop'
import { addPoopWithTimestamp, getLastPoop, hashId, poopStatsFromUserWithFilter } from '../database'
import { client } from '../whatsapp'
import moment from 'moment'

const help: Command = {
	name: 'compute',
	description: 'compute the poop insertion message',
	execute: async (message: Message, info: Info) => {
        let poopMessage = await message.getQuotedMessage()
        let messages = (await (await client.getChatById((await poopMessage.getChat()).id._serialized))
        .fetchMessages({limit: parseInt(info.args[0]) ?? 100}))
        let match = messages.find(m => m.id._serialized == poopMessage.id._serialized)

        if (match) {
            poopMessage = match
        }

        if (!poopMessage) {
            message.reply('❌ You must quote a message for this command')
        }

        if (!poopMessage.timestamp) {
            message.reply('❌ Cannot fetch message timestamp')
            return
        }

        if (poopValidator.validate(poopMessage.body)) {
            const number = (await message.getContact()).number
            const id = hashId(number)
            addPoopWithTimestamp(id, new Date(poopMessage.timestamp * 1000).toISOString())
            const stats = poopStatsFromUserWithFilter(
                id,
                moment().year(),
                moment().month() + 1,
            )
            const poop = getLastPoop()
            message.reply(
                '✅ Saved' +
                    '\nID: ' +
                    poop.id +
                    '\nTimestamp: ' +
                    poop.timestamp +
                    '\nRank: ' +
                    stats.monthlyLeaderboardPosition + '°' +
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
