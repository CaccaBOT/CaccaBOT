import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js'
import { updatePassword } from '../../database'
import crypto from 'crypto'
import { config } from '../../config/loader'

export default {
  data: new SlashCommandBuilder()
    .setName('password')
    .setDescription('Generate a new password for your account')
    .addStringOption((option) =>
      option.setName('userid').setDescription('Your user ID').setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    const userId = interaction.options.get('userid')?.value as string

    try {
      // Generate a random password
      const password = crypto.randomBytes(10).toString('hex')

      // Update the password in the database
      updatePassword(userId, password)

      // Send the password as a DM to ensure privacy
      await interaction.user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('🔑 New Password Generated')
            .setDescription(
              `Your CaccaBOT password is: **${password}**\n\nRemember to change it as soon as possible at ${config.serverUrl}`
            )
            .setColor(0xff0000)
            .setFooter({ text: 'Keep this password secure!' })
        ]
      })

      // Reply to the interaction in the channel
      await interaction.reply({
        content: '✅ A new password has been generated and sent to you via DM.',
        ephemeral: true
      })
    } catch (error) {
      console.error('Error generating password:', error)
      await interaction.reply({
        content: '❌ An error occurred while generating your password.',
        ephemeral: true
      })
    }
  }
}
