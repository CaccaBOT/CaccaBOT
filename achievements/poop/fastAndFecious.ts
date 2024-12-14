import {
	poopLeaderboardWithFilter,
	addAchievementToUser,
	getAchievement,
} from '../../database'
import moment from 'moment-timezone'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'
import { configuration } from '../..'

const timezone = configuration.timezone || 'UTC'

const fastAndFecious: Achievement = {
	id: 'FAST_AND_FECIOUS',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const year = moment().tz(timezone).year()
		const month = moment().tz(timezone).month() + 1
		const leaderboard = poopLeaderboardWithFilter(year, month)
		if (leaderboard.length == 1) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default fastAndFecious
