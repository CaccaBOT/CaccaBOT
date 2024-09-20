import { Message } from "whatsapp-web.js"
import { Poop } from "../../types/Poop"
import { RawUser } from "../../types/User"
import { poopStreak, addAchievementToUser, getAchievement } from '../../database'
import { Achievement } from "../../types/Achievement"

const scatLover: Achievement = {
	id: 'SCAT_LOVER',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const streak = poopStreak(user.id)
		if (streak >= 69) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}

export default scatLover;