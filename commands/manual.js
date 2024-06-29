module.exports = {
	name: 'manual',
	description: 'view the poop manual',
	execute: async (message, info) => {
		message.reply(`${config.frontendUrl}/manual`)
	},
}
