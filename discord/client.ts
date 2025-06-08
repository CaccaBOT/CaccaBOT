import { Client, Events, GatewayIntentBits } from 'discord.js'
import log from 'loglevel'
import fs from 'fs'
import path from 'path'
import { config } from '../config/loader'
import poopValidator from '../validators/poop'
import {
  addPoop,
  getLastPoop,
  poopStatsFromUserWithFilter,
  getUserByDiscordId,
  createUserFromDiscord
} from '../database'
import achievementChecker from '../achievements/check'
import moment from 'moment-timezone'

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ]
})

export let commands = new Map()

const commandFiles = fs
  .readdirSync(path.join(__dirname, 'commands'))
  .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))

client.once(Events.ClientReady, async (readyClient) => {
  for (const file of commandFiles) {
    try {
      const imported = await import(`./commands/${file}`)
      const command = imported.default

      if (command && command.data && command.execute) {
        commands.set(command.data.name, command)
        log.info(`[COMMAND] ${command.data.name}`)
      } else {
        log.warn(`[DISCORD] Command in ${file} is missing required properties`)
      }
    } catch (error) {
      log.error(`[COMMAND] Failed to load command from ${file}:`, error)
    }
  }

  log.info(`[DISCORD] Ready on ${readyClient.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand() || interaction.guild?.id !== config.guildId) {
    return
  }

  const command = commands.get(interaction.commandName)

  if (command) {
    try {
      await command.execute(interaction)
    } catch (error) {
      log.error(
        `[DISCORD] Error executing command ${interaction.commandName}:`,
        error
      )

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    }
  }
})

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) {
    return
  }

  if (poopValidator.validate(message.content)) {
    try {
      let userId = message.author.id
      let foundUser = getUserByDiscordId(userId)

      if (!foundUser.id) {
        createUserFromDiscord(userId, message.author.username)
        foundUser = getUserByDiscordId(userId)
      }

      addPoop(foundUser.id)

      const stats = poopStatsFromUserWithFilter(
        foundUser.id,
        moment().year(),
        moment().month() + 1
      )

      const poop = getLastPoop()

      await message.reply(
        '✅ Saved' +
          '\nID: ' +
          poop.id +
          '\nTimestamp: ' +
          poop.timestamp +
          '\nRank: ' +
          stats.monthlyLeaderboardPosition +
          '°' +
          '\nStreak: ' +
          stats.streak +
          '\nDaily AVG: ' +
          stats.poopAverage +
          '\nMonthly: ' +
          stats.monthlyPoops +
          '\nCertificate: ' +
          `${config.serverUrl}/poop/${poop.id}`
      )

      achievementChecker.checkPoopBased(foundUser, poop)
    } catch (error) {
      log.error('[DISCORD] Error processing poop message:', error)
    }
  }
})
