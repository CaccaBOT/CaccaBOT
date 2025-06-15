import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js'
import { getUserProfileByUsername, poopStatsFromUser } from '../database'
import { config } from '../config/loader'

export default {
  data: new SlashCommandBuilder()
    .setName('showprofile')
    .setDescription('Show a user profile')
    .addStringOption((option) =>
      option
        .setName('username')
        .setDescription('Username to look up')
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    const username = interaction.options.get('username')?.value as string
    const user = getUserProfileByUsername(username)

    if (!user) {
      await interaction.reply({
        content: `❌ User ${username} not found`,
        ephemeral: true
      })
      return
    }

    const stats = poopStatsFromUser(user.id)

    const embed = new EmbedBuilder()
      .setTitle(`Profile: ${user.username}`)
      .setColor(0x0099ff)

    if (user.pfp) {
      embed.setThumbnail(user.pfp)
    }

    if (user.bio) {
      embed.setDescription(user.bio)
    }

    embed.addFields(
      { name: 'Poops Today', value: stats.today.toString(), inline: true },
      { name: 'Poops This Week', value: stats.week.toString(), inline: true },
      { name: 'Poops This Month', value: stats.month.toString(), inline: true },
      { name: 'Total Poops', value: stats.total.toString(), inline: true },
      {
        name: 'Profile Link',
        value: `${config.serverUrl}/profile/${user.username}`
      }
    )

    await interaction.reply({ embeds: [embed] })
  }
}
