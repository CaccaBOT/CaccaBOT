import { poopLeaderboardWithFilter, addAchievementToUser, getAchievement } from '../../database'
import moment from 'moment'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'

const fastAndFecious: Achievement = {
	id: 'FAST_AND_FECIOUS',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const year = moment().year()
		const month = moment().month()
		const leaderboard = poopLeaderboardWithFilter(year, month)
		if (leaderboard.length == 1) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}

export default fastAndFecious;