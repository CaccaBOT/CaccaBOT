import { Client, Events, GatewayIntentBits } from 'discord.js'
import log from 'loglevel'

const token = process.env.DISCORD_TOKEN

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] })

client.once(Events.ClientReady, readyClient => {
	log.info(`[DISCORD] Ready on ${readyClient.user.tag}`);
})

client.on(Events.MessageCreate, message => {
    console.log(`[DISCORD] Message from ${message.author.tag}: ${message.content}`);
})