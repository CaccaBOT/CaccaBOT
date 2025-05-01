import { Client, Events, GatewayIntentBits } from 'discord.js'
import log from 'loglevel'
import fs from 'fs'
import path from 'path'
import { config } from '../config/loader'
import poopValidator from '../validators/poop'
import { 
    addPoop, 
    getUserProfileByPhone, 
    createUser, 
    getLastPoop, 
    poopStatsFromUserWithFilter 
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

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => 
    file.endsWith('.js') || file.endsWith('.ts')
);

client.once(Events.ClientReady, async readyClient => {
    for (const file of commandFiles) {
        try {
            const imported = await import(`./commands/${file}`)
            const command = imported.default;
            
            if (command && command.data && command.execute) {
                commands.set(command.data.name, command)
                log.info(`[DISCORD] Loaded command: ${command.data.name}`)
            } else {
                log.warn(`[DISCORD] Command in ${file} is missing required properties`)
            }
        } catch (error) {
            log.error(`[DISCORD] Failed to load command from ${file}:`, error)
        }
    }

    log.info(`[DISCORD] Ready on ${readyClient.user.tag}`)
    log.info(`[DISCORD] Loaded ${commands.size} commands`)
})

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const command = commands.get(interaction.commandName)

    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            log.error(`[DISCORD] Error executing command ${interaction.commandName}:`, error)
            
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
});

// client.on(Events.MessageCreate, async (message) => {
//     // Ignore bot messages
//     if (message.author.bot) return;
    
//     // Check if this is a valid poop message
//     if (poopValidator.validate(message.content)) {
//         // Check if this is in the configured channel
//         if (config.discordChannelId && message.channelId !== config.discordChannelId) {
//             return;
//         }
        
//         try {
//             // Get or create user
//             let userId = message.author.id;
//             let foundUser = getUserProfileByPhone(userId);
            
//             if (!foundUser.id) {
//                 // Create a new user
//                 createUser(
//                     userId, 
//                     message.author.username, 
//                     null // No bio initially
//                 );
//                 foundUser = getUserProfileByPhone(userId);
//             }
            
//             // Add the poop
//             addPoop(foundUser.id);
            
//             // Get stats
//             const stats = poopStatsFromUserWithFilter(
//                 foundUser.id,
//                 moment().year(),
//                 moment().month() + 1
//             );
            
//             // Get the last poop
//             const poop = getLastPoop();
            
//             // Reply with confirmation
//             const reply = await message.reply(
//                 '✅ Saved' +
//                 '\nID: ' +
//                 poop.id +
//                 '\nTimestamp: ' +
//                 poop.timestamp +
//                 '\nRank: ' +
//                 stats.monthlyLeaderboardPosition +
//                 '°' +
//                 '\nStreak: ' +
//                 stats.streak +
//                 '\nDaily AVG: ' +
//                 stats.poopAverage +
//                 '\nMonthly: ' +
//                 stats.monthlyPoops +
//                 '\nCertificate: ' +
//                 `${config.serverUrl}/poop/${poop.id}`
//             );
            
//             // Check for achievements
//             achievementChecker.checkPoopBased(foundUser, poop, {
//                 reply: (content) => reply.reply(content)
//             });
//         } catch (error) {
//             log.error('[DISCORD] Error processing poop message:', error);
//         }
//     }
// });