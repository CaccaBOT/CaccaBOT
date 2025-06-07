import {
  setMoney,
  getRarities,
  getCollectiblesOfRarity,
  addCollectibleToUser,
  addOpenedPack
} from '../../database'
import { authenticate } from '../../middleware/auth'
import { whatsappClient } from '../../whatsapp/index'
import { MessageMedia } from 'whatsapp-web.js'
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'
import achievementChecker from '../../achievements/check'
import { config } from '../../config/loader'
import { client } from '../../discord/client'
import log from 'loglevel'
import { EmbedBuilder, TextChannel } from 'discord.js'
import { rarityColors } from '../../utilities'

const openPackEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get('/open', async (req: FastifyRequest, res: FastifyReply) => {
    const user = await authenticate(req, res)

    if (user.money < 5) {
      res.code(403).send({ error: "You can't afford this item" })
      return
    }

    setMoney(user.id, user.money - 5)
    const rarities = getRarities()
    const rarity = pickRarity(rarities)
    const collectiblesOfRarity = getCollectiblesOfRarity(rarity.id)
    const collectible =
      collectiblesOfRarity[
        Math.floor(Math.random() * collectiblesOfRarity.length)
      ]
    addCollectibleToUser(user.id, collectible.id)
    addOpenedPack(user.id)
    if (config.whatsappModuleEnabled) {
      const media = await MessageMedia.fromUrl(collectible.asset_url)
      whatsappClient.sendMessage(config.groupId, media, {
        caption: `*[PACK] ${user.username}* found *${collectible.name}* (${rarities[collectible.rarity_id - 1].name})`
      })
    }
    achievementChecker.checkCollectibleBased(user, collectible)

    if (config.discordModuleEnabled) {
      const channels = client.guilds.cache.get(config.guildId)?.channels.cache
      const collectiblesChannel = channels?.find(c => c.name === 'collectibles')

      if (!collectiblesChannel) {
        log.warn("Collectibles channel not found, pack opening won't be broadcasted!")
      } else {
        const channel = await client.channels.fetch(collectiblesChannel.id)

        if (channel instanceof TextChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🎉 Pack Opened!')
            .setColor(rarityColors[rarities[collectible.rarity_id - 1].id])
            .setThumbnail(collectible.asset_url)
            .addFields(
              { name: 'User', value: `<@${user.discordId}>`, inline: true },
              { name: 'Collectible', value: `**${collectible.name}**`, inline: true },
              {
                name: 'Rarity',
                value: rarities[collectible.rarity_id - 1]?.name || 'Unknown',
                inline: true
              }
            )
            .setTimestamp()
            .setFooter({ text: 'Card Collectors • Pack Opening' });

          await channel.send({ embeds: [embed] });
        } else {
          log.warn('Fetched collectibles channel is not a text channel!')
        }
      }
    }

    res.code(200).send(collectible)
  })
}

function pickRarity(rarities: any) {
  const randomChance = Math.random() * 100
  let runningSum = 0

  for (const rarity of rarities) {
    runningSum += rarity.chance
    if (randomChance < runningSum) {
      return rarity
    }
  }
}

export default openPackEndpoint
