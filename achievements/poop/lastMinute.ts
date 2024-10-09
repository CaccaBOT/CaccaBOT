import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'

const lastMinute: Achievement = {
	id: 'LAST_MINUTE',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const date = moment.utc(poop.timestamp)
		const lastSecondOfMonth = moment.utc(date).endOf('month')
		const lastMinuteOfMonth = moment
			.utc(lastSecondOfMonth)
			.subtract(59, 'seconds')
		if (date.isBetween(lastMinuteOfMonth, lastSecondOfMonth, null, '[]')) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default lastMinute
