const { exec } = require('child_process')

module.exports = {
	name: 'uptime',
	description: 'see info about the host uptime',
	execute: async (message, info) => {
		exec('uptime', (error, stdout, stderr) => {
			message.reply(stdout)
		})
	},
}
