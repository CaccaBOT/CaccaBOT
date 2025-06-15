import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js'
import { poopStats } from '../database'

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('See stats about poop'),

  async execute(interaction: CommandInteraction) {
    const stats = poopStats()

    const embed = new EmbedBuilder()
      .setTitle('💩 Poop Stats')
      .setColor(0x8b4513)
      .addFields(
        { name: 'Today', value: stats.day.toString(), inline: true },
        { name: 'This Week', value: stats.week.toString(), inline: true },
        { name: 'This Month', value: stats.month.toString(), inline: true },
        { name: 'Total', value: stats.total.toString(), inline: true }
      )

    await interaction.reply({ embeds: [embed] })
  }
}
