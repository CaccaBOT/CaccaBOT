const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();

// Discord bot credentials
const clientId = '1363521664578621700';
const guildId = '1229739123770785792';
const token = process.env.DISCORD_BOT_TOKEN || '';

// Command loading logic
const commands = [];
const foldersPath = path.join(__dirname, '../build/discord/commands');

async function loadCommands() {
  const commandItems = fs.readdirSync(foldersPath);

  for (const item of commandItems) {
    const itemPath = path.join(foldersPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Read files inside this folder
      const commandFiles = fs.readdirSync(itemPath).filter(file =>
        file.endsWith('.js') || file.endsWith('.ts')
      );

      for (const file of commandFiles) {
        const filePath = path.join(itemPath, file);
        try {
          const commandModule = require(filePath);  // Use require here
          const command = commandModule.default || commandModule;

          if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
          } else {
            console.log(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
          }
        } catch (error) {
          console.error(`Error loading command from ${filePath}:`, error);
        }
      }
    } else if (item.endsWith('.js') || item.endsWith('.ts')) {
      // Handle single command file directly inside the commands folder
      try {
        const commandModule = require(itemPath);  // Use require here
        const command = commandModule.default || commandModule;

        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(
            `[WARNING] The command at ${itemPath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (error) {
        console.error(`Error loading command from ${itemPath}:`, error);
      }
    } else {
      console.log(`[SKIP] ${itemPath} is not a supported command file or directory`);
    }
  }
}

// Deploy your commands
async function deployCommands() {
  await loadCommands();

  const rest = new REST().setToken(token);

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    )

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
