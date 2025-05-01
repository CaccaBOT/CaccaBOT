import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import manualCommand from './manual'

export default {
	data: new SlashCommandBuilder()
		.setName('man')
		.setDescription('Alias to manual command'),

	async execute(interaction: CommandInteraction) {
		// Simply execute the manual command
		await manualCommand.execute(interaction)
	},
}
