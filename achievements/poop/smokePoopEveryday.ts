import { Message } from "whatsapp-web.js"
import { Poop } from "../../types/Poop"
import { RawUser } from "../../types/User"
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Achievement } from "../../types/Achievement"

const smokePoopEveryday: Achievement = {
	id: 'SMOKE_POOP_EVERYDAY',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const hour = moment(poop.timestamp).hour()
		const minute = moment(poop.timestamp).minute()
		if (hour == 4 && minute == 20) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}

export default smokePoopEveryday;