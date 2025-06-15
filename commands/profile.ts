import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import {
  updateUsername,
  updateProfilePicture,
  updateBio,
  isUsernameAvailable,
  getUserById
} from '../database'
import UsernameValidator from '../validators/username'
import achievementChecker from '../achievements/check'

export default {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Manage your profile')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('pic')
        .setDescription('Update your profile picture')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('URL of your new profile picture')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('username')
        .setDescription('Update your username')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('Your new username')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('bio')
        .setDescription('Update your bio')
        .addStringOption((option) =>
          option
            .setName('text')
            .setDescription('Your new bio')
            .setRequired(true)
        )
    ),

  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.get('subcommand')?.value as string

    const discordId = interaction.user.id
    const user = getUserById(discordId)

    if (!user) {
      await interaction.reply({
        content: "❌ You don't have a linked poop profile",
        ephemeral: true
      })
      return
    }

    switch (subcommand) {
      case 'pic':
        const picUrl = interaction.options.get('url')?.value as string
        updateProfilePicture(user.id, picUrl)
        break

      case 'username':
        const username = interaction.options.get('name')?.value as string
        if (!isUsernameAvailable(username)) {
          await interaction.reply({
            content: '❌ Username not available',
            ephemeral: true
          })
          return
        }

        if (!UsernameValidator.validate(username)) {
          await interaction.reply({
            content: '❌ Username not valid',
            ephemeral: true
          })
          return
        }

        updateUsername(user.id, username)
        break

      case 'bio':
        const bio = interaction.options.get('text')?.value as string
        updateBio(user.id, bio)
        break
    }

    achievementChecker.checkActionBased(user)

    await interaction.reply({
      content: '✅ Profile updated successfully!',
      ephemeral: true
    })
  }
}
