# CaccaBOT Server

This project was made to keep track of poops from every participant of a WhatsApp group designed for that purpose.

## Installation

### Requirements

- Docker Compose

### How to install and run

#### Create or add services to your Docker Compose configuration file

This configuration includes 3 services:
- Traefik, a reverse proxy to serve CaccaBOT on port 443
- Watchtower, to pull the latest updates immediately
- CaccaBOT, the application itself

This is just an example configuration which you can customize based on your needs

```yml
services:
  reverse-proxy:
    image: traefik:v3.1
    command:
      - '--providers.docker'
      - '--providers.docker.exposedbydefault=false'
      - '--entryPoints.websecure.address=:443'
      - '--entrypoints.websecure.http3'
      - '--certificatesresolvers.caccabotresolver.acme.tlschallenge=true'
      - '--certificatesresolvers.caccabotresolver.acme.email=caccabot@proton.me'
      - '--certificatesresolvers.caccabotresolver.acme.storage=/letsencrypt/acme.json'
      - '--entrypoints.web.address=:80'
      - '--entrypoints.web.http.redirections.entrypoint.to=websecure'
      - '--entrypoints.web.http.redirections.entrypoint.scheme=https'
      - '--accesslog=true'
    ports:
      - '80:80'
      - '443:443'
      - '443:443/udp'
    volumes:
      - letsencrypt:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock

  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=30
      - WATCHTOWER_LABEL_ENABLE=true
    deploy:
      update_config:
        order: start-first

  caccabot:
    image: ghcr.io/caccabot/caccabot:latest
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.caccabot.rule=Host(`your.domain.here`)'
      - 'traefik.http.routers.caccabot.entrypoints=websecure'
      - 'traefik.http.routers.caccabot.tls.certresolver=caccabotresolver'
      - 'traefik.http.services.caccabot.loadbalancer.server.scheme=h2c'
      - 'com.centurylinklabs.watchtower.enable=true'
      - 'traefik.http.middlewares.test-compress.compress.defaultEncoding=zstd'
    volumes:
      - /your/volume/path/here/storage:/app/storage/
      - /your/volume/path/here/wwebjs_auth:/app/.wwebjs_auth
      - /your/volume/path/here/wwebjs_cache:/app/.wwebjs_cache
      - /your/volume/path/here/pfp:/app/public/pfp
      - type: bind
        source: /your/volume/path/here/config.json
        target: /app/config/config_prod.json
    environment:
      - ENVIRONMENT=production
      - SERVER_PORT=3000
    deploy:
      update_config:
        order: start-first
    ports:
      - '3000:3000'
    expose:
      - '3000'

volumes:
  caccabot_data:
  letsencrypt:
```

#### Create and edit the `config_prod.json` file on the mapped volume to your liking

```json
{
	"name": "CaccaBOT",
	"description": "Welcome to CaccaBOT",
	"prefix": "cacca",
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

`groupId`: Leave this unchanged. When the bot starts, and you try using a command, it will send a message with the group ID. Paste that ID into this property to mark the group as the active CaccaBOT group.

`whatsappModuleEnabled`: leave this untouched unless you want to suspend all whatsapp functionality and only leave the web server active

`monthlyPurge`: if set to true it will kick and delete all users who have not been active for more than a month at every start of the month

#### Edit the `.env` file to your liking

```bash
ENVIRONMENT=production
SERVER_PORT=3000
```

`ENVIRONMENT`: leave this untouched, production is the environment you want to run CaccaBOT on your group. Switch to `dev` if you're writing features and testing locally

`SERVER_PORT`: the webserver port, ideally leave this on port 3000 or a not well known port and manage routing with a reverse proxy like nginx or traefik

#### Run the server

in order to run the server you have to start the container

```
docker compose up -d
```

#### Expected output

If you did everything correctly you should see something like this in your container logs

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
