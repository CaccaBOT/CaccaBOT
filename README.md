# CaccaBOT Server

This project was made to keep track of poops from every participant of a WhatsApp group designed for that purpose.

## Installation

### Requirements

- Node 18 or greater
- npm

### How to install and run

#### Clone the repository

```bash
git clone https://github.com/CaccaBOT/CaccaBOT-Server.git
```

#### Edit the `config.json` file to your liking

```json
{
	"name": "CaccaBOT",
	"description": "Welcome to CaccaBOT",
	"prefix": "cacca",
	"version": "v5.4.0",
	"serverUrl": "https://caccabot.duckdns.org",
	"groupId": null,
	"whatsappModuleEnabled": true,
	"monthlyPurge": true
}
```

`name`: the name of your instance (will appear on the home page)

`description`: the description of your instance (will appear on the home page)

`prefix`: the magic word for the bot to interpret commands inside the group

`version`: leave this untouched

`serverUrl`: where the server is hosted

`groupId`: leave this untouched, when the bot will start and you'll try using a command it will send a message with the group ID, paste that id on this property to mark the group as the active CaccaBOT group

`whatsappModuleEnabled`: leave this untouched unless you want to suspend all whatsapp functionality and only leave the web server active

`monthlyPurge`: if set to true it will kick and delete all users who have not been active for more than a month at every start of the month

#### Edit the `.env` file to your liking

```bash
ENVIRONMENT=production
SERVER_PORT=3000
```

`ENVIRONMENT`: leave this untouched, production is the environment you want to run CaccaBOT on your group. Switch to `test` if you're writing features and testing locally

`SERVER_PORT`: the webserver port, ideally leave this on port 3000 or a not well known port and manage routing with a reverse proxy like nginx

#### Run the server

in order to run the server you have to enter the CaccaBOT directory and run the `index.js` file with `node`

```
cd CaccaBOT-Server
ts-node index.ts
```

However the process will close as soon as you close the SSH session on your remote machine.

To avoid that use a solution like `PM2`

find the docs at https://pm2.keymetrics.io/

```bash
npm install pm2 typescript ts-node -g
pm2 start --interpreter ts-node --interpreter-args "--project tsconfig.json --swc" index.ts --name CaccaBOT
```

this will leave the process in the background even after the SSH session is closed

#### Expected output

If you did everything correctly you should see something like this in your terminal

```
▄████▄   ▄▄▄       ▄████▄   ▄████▄   ▄▄▄       ▄▄▄▄    ▒█████  ▄▄▄█████▓
▒██▀ ▀█  ▒████▄    ▒██▀ ▀█  ▒██▀ ▀█  ▒████▄    ▓█████▄ ▒██▒  ██▒▓  ██▒ ▓▒
▒▓█    ▄ ▒██  ▀█▄  ▒▓█    ▄ ▒▓█    ▄ ▒██  ▀█▄  ▒██▒ ▄██▒██░  ██▒▒ ▓██░ ▒░
▒▓▓▄ ▄██▒░██▄▄▄▄██ ▒▓▓▄ ▄██▒▒▓▓▄ ▄██▒░██▄▄▄▄██ ▒██░█▀  ▒██   ██░░ ▓██▓ ░
▒ ▓███▀ ░ ▓█   ▓██▒▒ ▓███▀ ░▒ ▓███▀ ░ ▓█   ▓██▒░▓█  ▀█▓░ ████▓▒░  ▒██▒ ░
░ ░▒ ▒  ░ ▒▒   ▓▒█░░ ░▒ ▒  ░░ ░▒ ▒  ░ ▒▒   ▓▒█░░▒▓███▀▒░ ▒░▒░▒░   ▒ ░░
  ░  ▒     ▒   ▒▒ ░  ░  ▒     ░  ▒     ▒   ▒▒ ░▒░▒   ░   ░ ▒ ▒░     ░
░          ░   ▒   ░        ░          ░   ▒    ░    ░ ░ ░ ░ ▒    ░
░ ░            ░  ░░ ░      ░ ░            ░  ░ ░          ░ ░
░                  ░        ░                        ░
```
