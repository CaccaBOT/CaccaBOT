import log from 'loglevel'
import { config } from '../../config/loader'
import { client } from '../../discord/client'
import { CollectibleEvent } from '../../types/events/CollectibleEvent'
import { EventTypeEnum } from '../../types/events/EventType'
import { events } from '../events'
import { EmbedBuilder, TextChannel } from 'discord.js'
import { rarityColors } from '../../utilities'
import AchievementChecker from '../../achievements/check'
import { AchievementEvent } from '../../types/events/AchievementEvent'
import { getRarities } from '../../database'

const rarities = getRarities()

events.on(EventTypeEnum.ACHIEVEMENT, async (data: AchievementEvent) => {
  if (!config.discordModuleEnabled) {
    return
  }

  const channels = client.guilds.cache.get(config.guildId)?.channels.cache
  const achievementsChannel = channels?.find((c) => c.name === 'achievements')

  if (!achievementsChannel) {
    log.warn(
      "Achievements channel not found, achievements won't be broadcasted!"
    )
  } else {
    const channel = await client.channels.fetch(achievementsChannel.id)

    if (channel instanceof TextChannel) {
      const achievement = data.achievement
      console.log(achievement)
      const embed = new EmbedBuilder()
        .setTitle('🏆 Achievement Unlocked!')
        .setColor(rarityColors[achievement.difficulty_id])
        .addFields(
          { name: 'User', value: `<@${data.user.discordId}>`, inline: true },
          {
            name: 'Achievement',
            value: `**${achievement.name}**`,
            inline: true
          },
          {
            name: 'Difficulty',
            value: achievement.difficulty_id.toString() || 'Unknown',
            inline: true
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Achievements • Achievement Unlocked' })

      await channel.send({ embeds: [embed] })
    } else {
      log.warn('Fetched achievements channel is not a text channel!')
    }
  }
})
