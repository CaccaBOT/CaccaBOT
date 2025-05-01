import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js'
import { commands } from '../client'
import { version } from '../../package.json'
import { config } from '../../config/loader'

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display a help message')
		.addStringOption((option) =>
			option
				.setName('command')
				.setDescription('Get help for a specific command')
				.setRequired(false),
		),

	async execute(interaction: CommandInteraction) {
		const commandName = interaction.options.get('command')?.value as
			| string
			| undefined
		const embed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle('Help')
			.setFooter({
				text: `CaccaBOT ${version}-${process.env.ENVIRONMENT ?? 'test'}`,
			})

		if (commandName) {
			const command = Array.from(commands.values()).find(
				(cmd) => cmd.data.name === commandName,
			)

			if (command) {
				embed.setDescription(
					`**Command:** ${command.data.name}\n${command.data.description}`,
				)
			} else {
				embed.setDescription('Command not found')
			}
		} else {
			const commandList = Array.from(commands.values())
				.map((cmd) => cmd.data.name)
				.join(', ')

			embed.setDescription(
				`**Commands:**\n${commandList}\n\n**Website:**\n${config.serverUrl}`,
			)
		}

		await interaction.reply({ embeds: [embed] })
	},
}
