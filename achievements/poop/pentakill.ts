import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import {
	poopStatsFromUser,
	addAchievementToUser,
	getAchievement,
} from '../../database'

const pentakill: Achievement = {
	id: 'PENTAKILL',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const stats = poopStatsFromUser(user.id)
		if (stats.today >= 5) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default pentakill
