const { commands } = require('../whatsapp/index')

module.exports = {
	name: 'man',
	description: 'alias to manual',
	execute: async (message, info) => {
		commands.find((x) => x.name == 'manual').execute(message, info)
	},
}
