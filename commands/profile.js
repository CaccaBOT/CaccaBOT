const {
	updateUsername,
	updateProfilePicture,
	updateBio,
	getUserProfileByPhone,
	getUserProfileByUsername,
} = require('../database/index')

module.exports = {
	name: 'profile',
	description: 'manage your profile',
	execute: async (message, info) => {
		const user = getUserProfileByPhone(message.author)
		if (!user.id) {
			message.reply(
				`You don't have a poop profile.\nIt'll be automatically created when you poop the first time`
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
				if (isUsernameAvailable) {
					user.username = username
				}
				updateUsername(user.id, username)
				break
			case 'bio':
				let bio = info.args.join(' ')
				bio = bio.substring(3, bio.length)
				updateBio(user.id, bio)
				break
			default:
				message.reply('Invalid argument\nAvailable: pic, username, bio')
				return
		}
		message.reply('✅ Saved')
	},
}
