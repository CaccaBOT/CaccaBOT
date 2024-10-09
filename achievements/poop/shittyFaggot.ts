import { Message } from 'whatsapp-web.js'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Achievement } from '../../types/Achievement'

const shittyFaggot: Achievement = {
	id: 'SHITTY_FAGGOT',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const month = moment(poop.timestamp).month()
		if (month == 6) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default shittyFaggot
