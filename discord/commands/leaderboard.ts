import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js'
import { poopLeaderboardWithFilter } from '../../database'
import { config } from '../../config/loader'

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the monthly poop leaderboard'),

  async execute(interaction: CommandInteraction) {
    const now = new Date()
    const leaderboard = poopLeaderboardWithFilter(
      now.getFullYear(),
      now.getMonth() + 1
    )

    const monthName = new Date().toLocaleDateString('default', {
      year: 'numeric',
      month: 'long'
    })

    const embed = new EmbedBuilder()
      .setTitle(`Leaderboard for ${monthName}`)
      .setColor(0xffd700)
      .setFooter({
        text: `View the full leaderboard at ${config.serverUrl}/leaderboard`
      })

    if (leaderboard.length === 0) {
      embed.setDescription('No entries for this month yet!')
    } else {
      // Create a formatted leaderboard string
      let leaderboardText = ''

      // Only show top 10 to avoid Discord message limits
      const displayCount = Math.min(leaderboard.length, 10)

      for (let i = 0; i < displayCount; i++) {
        const entry = leaderboard[i]
        const medal =
          i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}°`
        leaderboardText += `${medal} **${entry.username}** - ${entry.poops} poops\n`
      }

      embed.setDescription(leaderboardText)
    }

    await interaction.reply({ embeds: [embed] })
  }
}
