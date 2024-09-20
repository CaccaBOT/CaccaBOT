import { Achievement } from "../../types/Achievement"
import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from "../../types/Poop"
import { RawUser } from "../../types/User"
import { Message } from "whatsapp-web.js"

const iBecameRich: Achievement = {
	id: 'I_BECAME_RICH',
	check: function (poop: Poop, user: RawUser, message: Message) {
		addAchievementToUser(user.id, this.id)
		const achievement = getAchievement(this.id)
		message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
	},
}

export default iBecameRich;