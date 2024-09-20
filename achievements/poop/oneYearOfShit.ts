import { Message } from "whatsapp-web.js"
import { RawUser } from "../../types/User"
import { Poop } from "../../types/Poop"
import { Achievement } from "../../types/Achievement"
import { poopStreak, addAchievementToUser, getAchievement } from '../../database/'

const oneYearOfShit: Achievement = {
	id: 'ONE_YEAR_OF_SHIT',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const streak = poopStreak(user.id)
		if (streak >= 365) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`)
		}
	},
}

export default oneYearOfShit;