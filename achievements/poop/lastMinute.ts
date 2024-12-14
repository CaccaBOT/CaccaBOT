import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'
import { configuration } from '../..'


const timezone = configuration.timezone || 'UTC'


const lastMinute: Achievement = {
	id: 'LAST_MINUTE',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const date = moment.tz(poop.timestamp, timezone)
		const lastSecondOfMonth = moment.tz(date, timezone).endOf('month')
		const lastMinuteOfMonth = moment.tz(lastSecondOfMonth,timezone).subtract(59, 'seconds')
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
