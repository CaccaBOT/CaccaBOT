import { Client, Events, GatewayIntentBits } from 'discord.js'
import log from 'loglevel'
import fs from 'fs'
import path from 'path'

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] })
export let commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

client.once(Events.ClientReady, async readyClient => {

    for (const file of commandFiles) {
        const imported = await import(`./commands/${file}`)
        const command = imported.default;
        commands.set(command.data.name, command);
    }

    log.info(`[DISCORD] Ready on ${readyClient.user.tag}`)
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName)

    if (command) {
        try {

            await command.execute(interaction);
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply('There was an error while executing this command!');
        }
    }
});