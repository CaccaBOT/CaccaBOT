import { Message } from 'whatsapp-web.js'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'

import config from '../../config.json'

const timezone = config.timezone || 'UTC'

const skibidiToilet = {
	id: 'SKIBIDI_TOILET',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const hour = moment.tz(poop.timestamp,timezone).hour()
		const minute = moment.tz(poop.timestamp,timezone).minute()
		if ((hour == 3 && minute <= 5) || (hour == 2 && minute >= 55)) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default skibidiToilet
