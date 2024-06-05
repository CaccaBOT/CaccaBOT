const { poopStats } = require('../database')

module.exports = {
	name: 'stats',
	description: 'see stats about poop',
	execute: async (message, info) => {
		let stats = poopStats()
		let statsMsg = `*Time*  | *Count*\n`
		for (const stat of Object.entries(stats)) {
			statsMsg += `${stat[0].padEnd(5)} | ${stat[1]}\n`
		}
		message.reply(statsMsg)
	},
}
