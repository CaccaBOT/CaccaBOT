import { Message } from "whatsapp-web.js"
import { Command, Info } from "../types/Command"
import { updateUsername, updateProfilePicture, updateBio, getUserProfileByPhone, getUserProfileByUsername, checkAchievementForUser } from '../database/index'
import path from 'path'
import fs from 'fs'
import { RawUser } from "../types/User"

const profile: Command = {
	name: 'profile',
	description: 'manage your profile',
	execute: async (message: Message, info: Info) => {
		const user = getUserProfileByPhone(message.author!)
		if (!user.id) {
			message.reply(
				`❌ You don't have a poop profile.\nIt'll be automatically created when you poop the first time`,
			)
			return
		}

		switch (info.args[0]) {
			case 'pic':
				let pic = info.args[1]
				updateProfilePicture(user.id, pic)
				break
			case 'username':
				let username = info.args[1]
				const isUsernameAvailable =
					getUserProfileByUsername(user.username).id == null
				if (!isUsernameAvailable) {
					message.reply('❌ Username not available')
					break
				}
				user.username = username
				updateUsername(user.id, username)
				break
			case 'bio':
				let bio = info.args.join(' ')
				bio = bio.substring(3, bio.length)
				updateBio(user.id, bio)
				break
			default:
				message.reply('❌ Invalid argument\nAvailable: pic, username, bio')
				return
		}
		checkAchievements(user)
		message.reply('✅ Saved')
	},
}

function checkAchievements(user: RawUser) {
	const achievementsDir = path.resolve(`${__dirname}/../achievements/action`)
	fs.readdirSync(achievementsDir).forEach((file) => {
		const achievement = require(`${achievementsDir}/${file}`)
		if (!checkAchievementForUser(user.id, achievement.id)) {
			achievement.check(user)
		}
	})
}

export default profile;
