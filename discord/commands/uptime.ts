import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Check the bot uptime'),

	async execute(interaction: CommandInteraction) {
		const uptime = process.uptime()
		const days = Math.floor(uptime / 86400)
		const hours = Math.floor((uptime % 86400) / 3600)
		const minutes = Math.floor((uptime % 3600) / 60)
		const seconds = Math.floor(uptime % 60)

		const formattedUptime = `${days}d ${hours}h ${minutes}m ${seconds}s`

		const embed = new EmbedBuilder()
			.setTitle('🤖 Uptime')
			.setDescription(`The bot has been running for **${formattedUptime}**`)
			.setColor(0x00ff00)

		await interaction.reply({ embeds: [embed] })
	},
}
