import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js'
import {
  rawQuery,
  getUserProfileById,
  isUserAdmin,
  getUserByDiscordId
} from '../../database'

export default {
  data: new SlashCommandBuilder()
    .setName('query')
    .setDescription('Execute a raw SQL query on the database (admin only)')
    .addStringOption((option) =>
      option
        .setName('sql')
        .setDescription('SQL query to execute')
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    // Check if user is admin
    const isAdmin = isUserAdmin(getUserByDiscordId(interaction.user.id).id)

    if (!isAdmin) {
      await interaction.reply({
        content: '❌ You are not allowed to perform raw SQL queries',
        ephemeral: true
      })
      return
    }

    const sql = interaction.options.get('sql')?.value as string

    try {
      const result = rawQuery(sql)

      // Format the result for display
      let formattedResult = JSON.stringify(result, null, 2)

      // If the result is too long, truncate it
      if (formattedResult.length > 1900) {
        formattedResult =
          formattedResult.substring(0, 1900) + '...\n(Result truncated)'
      }

      const embed = new EmbedBuilder()
        .setTitle('SQL Query Result')
        .setDescription('```json\n' + formattedResult + '\n```')
        .setColor(0x00ff00)

      await interaction.reply({
        embeds: [embed]
      })
    } catch (error) {
      console.error('Error executing query:', error)

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'

      const embed = new EmbedBuilder()
        .setTitle('SQL Query Error')
        .setDescription('```\n' + errorMessage + '\n```')
        .setColor(0xff0000)

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      })
    }
  }
}
