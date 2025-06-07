import log from "loglevel"
import { config } from "../../config/loader"
import { client } from "../../discord/client"
import { CollectibleActionEnum } from "../../types/events/CollectibleActionEnum"
import { CollectibleEvent } from "../../types/events/CollectibleEvent"
import { EventTypeEnum } from "../../types/events/EventType"
import { events } from "../events"
import { EmbedBuilder, TextChannel } from "discord.js"
import { getAllCollectibles, getRarities } from "../../database"
import { rarityColors } from "../../utilities"

const collectibles = getAllCollectibles()
const rarities = getRarities()

events.on(EventTypeEnum.COLLECTIBLE, (data: CollectibleEvent) => {
  switch (data.action) {
    case CollectibleActionEnum.CONVERT:
      handleConvert(data)
      break;

    // handle other actions if needed
    default:
      console.warn(`Unhandled collectible action: ${data.action}`)
  }
});

async function handleConvert(data: CollectibleEvent) {
  if (!config.discordModuleEnabled) return

  const channels = client.guilds.cache.get(config.guildId)?.channels.cache
  const collectiblesChannel = channels?.find(c => c.name === 'collectibles')

  if (!collectiblesChannel) {
    log.warn("Collectibles channel not found, conversion won't be broadcasted!")
    return;
  }

  const channel = await client.channels.fetch(collectiblesChannel.id)
  if (!(channel instanceof TextChannel)) {
    log.warn('Fetched collectibles channel is not a text channel!')
    return;
  }

  const userMention = data.user.discordId ? `<@${data.user.discordId}>` : data.user.username
  const embeds: EmbedBuilder[] = []

  for (const ownership of data.collectibles) {
    const collectible = collectibles.find(c => c.id == ownership.collectible_id)
    if (!collectible) continue

    const rarity = rarities.find(r => r.id === collectible.rarity_id)
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
  }

  for (const embed of embeds) {
    await channel.send({ embeds: [embed] })
  }
}
