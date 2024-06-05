const { commands } = require('../whatsapp/index')

module.exports = {
	name: 'rank',
	description: 'alias to leaderboard',
	execute: async (message, info) => {
		commands.find((x) => x.name == 'leaderboard').execute(message, info)
	},
}
