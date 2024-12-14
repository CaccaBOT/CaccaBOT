import { Job } from '../types/Job'
import { client } from '../whatsapp'
import { deleteUser, getInactiveUsers } from '../database'
import moment from 'moment'
import { RawUser } from '../types/User'
import { GroupChat } from 'whatsapp-web.js'
import { config } from '../config/loader'

const monthlyPurge: Job = {
	name: 'Monthly Purge',
	interval: '0 0 1 * *',
	execute: async () => {
		if (config.monthlyPurge && config.whatsappModuleEnabled) {
			console.info(
				'[PURGE] Running Monthly Purge for ' +
					moment().subtract(1, 'month').format('MMMM YYYY'),
			)

			let purgeMsg = '*Running Monthly Purge*\n'
			const chat = await client.getChatById(config.groupId)
			if (chat.isGroup) {
				const inactiveUsers = getInactiveUsers(
					moment().subtract(1, 'month').toDate(),
				)
				purgeMsg += inactiveUsers.map((u: RawUser) => u.username).join('\n')
				for (const user of inactiveUsers) {
					deleteUser(user.id)
					if (
						inactiveUsers.map((u: RawUser) => u.phone).includes(user.id.user)
					) {
						await (chat as GroupChat).removeParticipants([user.id._serialized])
					}
				}
			}

			chat.sendMessage(purgeMsg)
		}
	},
}

export default monthlyPurge
