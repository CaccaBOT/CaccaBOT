import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js'
import { getAllUsers } from '../database'

const USERS_PER_PAGE = 25

export default {
  data: new SlashCommandBuilder()
    .setName('users')
    .setDescription('List all registered users')
    .addIntegerOption((option) =>
      option
        .setName('page')
        .setDescription('Page number to display')
        .setRequired(false)
        .setMinValue(1)
    ),

  async execute(interaction: CommandInteraction) {
    const users = getAllUsers()

    if (!users || users.length === 0) {
      await interaction.reply('No users found in the database.')
      return
    }

    const initialPage = (interaction.options.get('page')?.value as number) || 1
    try {
      await showPage(interaction, users, initialPage)
    } catch (_) {}
  }
}

async function showPage(
  interaction: CommandInteraction | ButtonInteraction,
  users: any[],
  page: number
) {
  const maxPages = Math.ceil(users.length / USERS_PER_PAGE)

  // Ensure page is within valid range
  page = Math.max(1, Math.min(page, maxPages))

  const startIndex = (page - 1) * USERS_PER_PAGE
  const endIndex = Math.min(startIndex + USERS_PER_PAGE, users.length)
  const pageUsers = users.slice(startIndex, endIndex)

  const embed = new EmbedBuilder()
    .setTitle('Registered Users')
    .setColor(0x0099ff)
    .setDescription(`Total users: ${users.length} | Page ${page}/${maxPages}`)

  let userList = ''

  for (let i = 0; i < pageUsers.length; i++) {
    const user = pageUsers[i]
    userList += `${startIndex + i + 1}. **${user.username}**${user.frozen ? ' 🧊' : ''}\n`
  }

  embed.addFields({
    name: 'Users',
    value: userList || 'No users on this page'
  })

  // Create navigation buttons
  const prevButton = new ButtonBuilder()
    .setCustomId('prev_page')
    .setLabel('Previous')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(page <= 1)

  const nextButton = new ButtonBuilder()
    .setCustomId('next_page')
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(page >= maxPages)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    prevButton,
    nextButton
  )

  const messageOptions = {
    embeds: [embed],
    components: [row]
  }

  try {
    if (interaction instanceof ButtonInteraction) {
      await interaction.update(messageOptions)
    } else {
      await interaction.reply(messageOptions)
    }
  } catch (err) {
    console.error('Failed to respond to interaction:', err)
    return
  }

  let message
  try {
    message = await interaction.fetchReply()
  } catch (err) {
    console.error('Failed to fetch message:', err)
    return
  }

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000 // 1 minute timeout
  })

  collector.on('collect', async (buttonInteraction) => {
    collector.resetTimer()

    let newPage = page
    if (buttonInteraction.customId === 'prev_page') {
      newPage = page - 1
    } else if (buttonInteraction.customId === 'next_page') {
      newPage = page + 1
    }

    await showPage(buttonInteraction, users, newPage)
  })

  collector.on('end', async () => {
    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      prevButton.setDisabled(true),
      nextButton.setDisabled(true)
    )

    try {
      await message.edit({ components: [disabledRow] })
    } catch (error) {
      console.error('Failed to update message with disabled buttons:', error)
    }
  })
}
