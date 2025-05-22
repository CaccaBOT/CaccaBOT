import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js'
import { poopLeaderboardWithFilter } from '../../database'

export default {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your position in the poop leaderboard')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to check rank for (defaults to yourself)')
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction) {
    const targetUser = interaction.user
    const now = new Date()

    // Get the leaderboard for the current month
    const leaderboard = poopLeaderboardWithFilter(
      now.getFullYear(),
      now.getMonth() + 1
    )

    // Find the user in the leaderboard by Discord ID
    const userEntry = leaderboard.find(
      (entry: { discordId: any }) => entry.discordId === targetUser.id
    )

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Poop Rank')
      .setThumbnail(targetUser.displayAvatarURL())

    if (!userEntry) {
      embed.setDescription(
        `${targetUser.username} is not ranked this month. They need to link their Discord account and poop!`
      )
    } else {
      const { rank, poops, username } = userEntry
      let medal = ''

      if (rank === 1) medal = '🥇'
      else if (rank === 2) medal = '🥈'
      else if (rank === 3) medal = '🥉'

      embed.setDescription(
        `**${username}** is ranked **${rank}${medal ? ' ' + medal : ''}** with **${poops}** poops this month!`
      )

      // Add some additional stats if available
      if (userEntry.streak) {
        embed.addFields({
          name: 'Current Streak',
          value: `${userEntry.streak} days`,
          inline: true
        })
      }
    }

    await interaction.reply({ embeds: [embed] })
  }
}
