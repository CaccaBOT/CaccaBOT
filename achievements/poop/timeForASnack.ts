import { Message } from 'whatsapp-web.js'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Achievement } from '../../types/Achievement'
import { configuration } from '../..'

const timezone = configuration.timezone || 'UTC'

const timeForASnack: Achievement = {
	id: 'TIME_FOR_A_SNACK',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const timestamp = moment.tz(poop.timestamp, timezone).hour()
		if (timestamp >= 16 && timestamp < 18) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default timeForASnack
