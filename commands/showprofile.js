const { client } = require('../whatsapp/index')
const { getUserProfileByUsername } = require('../database/index')
const config = require('../config.json')

module.exports = {
	name: 'showprofile',
	description: 'view the profile of a user',
	execute: async (message, info) => {
        if (!info.args[0]) {
			message.reply('❌ Please provide a username')
            return
        }

        const username = info.args[0]
        const user = getUserProfileByUsername(username)

        console.log(user)

        if (!user.id) {
            message.reply('❌ User does not exist')
            return
        }

        message.reply(
        '*ID*: ' + user.id + '\n' +
        '*Username*: ' + user.username + '\n' +
        '*Bio*: ' + (user.bio ?? 'N/A') + '\n' +
        '*Frozen*: ' + (user.frozen == 0 ? 'No' : 'Yes') + '\n' +
        '*Poops*: ' + user.poops + '\n' +
        '*Merdollars*: ' + user.money
        )
	}
}

function sanitizeId(id) {
	return id.match(/^\d+/)[0]
}
