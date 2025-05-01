import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js'
import { config } from '../../config/loader'

export default {
	data: new SlashCommandBuilder()
		.setName('manual')
		.setDescription('View the poop manual'),

	async execute(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle('📚 Poop Manual')
			.setDescription(
				`Check out the complete poop manual at: ${config.serverUrl}/manual`,
			)
			.setColor(0x8b4513)

		await interaction.reply({ embeds: [embed] })
	},
}
