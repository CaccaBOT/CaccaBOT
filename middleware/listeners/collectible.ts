import log from 'loglevel'
import { config } from '../../config/loader'
import { client } from '../../discord/client'
import { CollectibleActionEnum } from '../../types/events/CollectibleActionEnum'
import { CollectibleEvent } from '../../types/events/CollectibleEvent'
import { EventTypeEnum } from '../../types/events/EventType'
import { events } from '../events'
import { EmbedBuilder, TextChannel } from 'discord.js'
import { getAllCollectibles, getRarities } from '../../database'
import { rarityColors } from '../../utilities'
import AchievementChecker from '../../achievements/check'

const collectibles = getAllCollectibles()
const rarities = getRarities()

const listenerMap = new Map<string, (data: CollectibleEvent) => void>()

listenerMap.set(CollectibleActionEnum.CONVERT, handleConvert)
listenerMap.set(CollectibleActionEnum.OPEN_PACK, handleOpenPack)

async function handleOpenPack(data: CollectibleEvent) {
  if (!config.discordModuleEnabled) {
    return
  }

  const channels = client.guilds.cache.get(config.guildId)?.channels.cache
  const collectiblesChannel = channels?.find((c) => c.name === 'collectibles')

  if (!collectiblesChannel) {
    log.warn(
      "Collectibles channel not found, pack opening won't be broadcasted!"
    )
  } else {
    const channel = await client.channels.fetch(collectiblesChannel.id)

    if (channel instanceof TextChannel) {
      for (let ownership of data.collectibles) {
        const collectible = collectibles.find(
          (c) => c.id == ownership.collectible_id
        )!
        const embed = new EmbedBuilder()
          .setTitle('🎉 Pack Opened!')
          .setColor(rarityColors[rarities[collectible.rarity_id - 1].id])
          .setThumbnail(collectible.asset_url!)
          .addFields(
            { name: 'User', value: `<@${data.user.discordId}>`, inline: true },
            {
              name: 'Collectible',
              value: `**${collectible.name}**`,
              inline: true
            },
            {
              name: 'Rarity',
              value: rarities[collectible.rarity_id - 1]?.name || 'Unknown',
              inline: true
            }
          )
          .setTimestamp()
          .setFooter({ text: 'Card Collectors • Pack Opening' })

        await channel.send({ embeds: [embed] })
        AchievementChecker.checkCollectibleBased(data.user, collectible)
      }
    } else {
      log.warn('Fetched collectibles channel is not a text channel!')
    }
  }
}

async function handleConvert(data: CollectibleEvent) {
  if (!config.discordModuleEnabled) return

  const channels = client.guilds.cache.get(config.guildId)?.channels.cache
  const collectiblesChannel = channels?.find((c) => c.name === 'collectibles')

  if (!collectiblesChannel) {
    log.warn("Collectibles channel not found, conversion won't be broadcasted!")
    return
  }

  const channel = await client.channels.fetch(collectiblesChannel.id)
  if (!(channel instanceof TextChannel)) {
    log.warn('Fetched collectibles channel is not a text channel!')
    return
  }

  const userMention = data.user.discordId
    ? `<@${data.user.discordId}>`
    : data.user.username
  const embeds: EmbedBuilder[] = []

  for (const ownership of data.collectibles) {
    const collectible = collectibles.find(
      (c) => c.id == ownership.collectible_id
    )
    if (!collectible) continue

    const rarity = rarities.find((r) => r.id === collectible.rarity_id)
    const color = rarity ? rarityColors[rarity.id] : 0x808080

    const embed = new EmbedBuilder()
      .setTitle('♻️ Collectible Converted!')
      .setColor(color)
      .setThumbnail(collectible.asset_url!)
      .addFields(
        { name: 'User', value: userMention, inline: true },
        { name: 'Collectible', value: `**${collectible.name}**`, inline: true },
        { name: 'Rarity', value: rarity?.name || 'Unknown', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Card Collectors • Conversion' })

    embeds.push(embed)
    AchievementChecker.checkCollectibleBased(data.user, collectible)
  }

  for (const embed of embeds) {
    await channel.send({ embeds: [embed] })
  }
}

events.on(EventTypeEnum.COLLECTIBLE, (data: CollectibleEvent) => {
  const handler = listenerMap.get(data.action)
  if (!handler) {
    log.warn(`No handler found for action ${data.action}`)
    return
  }

  try {
    handler(data)
  } catch (error) {
    log.error(`Error handling collectible event: ${error}`)
  }
})
