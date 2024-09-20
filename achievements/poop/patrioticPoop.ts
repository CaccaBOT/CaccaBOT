import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database/'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'

const patrioticPoop: Achievement = {
	id: 'PATRIOTIC_POOP',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const month = moment(poop.timestamp).month()
		const day = moment(poop.timestamp).day()
		if (month == 5 && day == 2) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}

export default patrioticPoop;
