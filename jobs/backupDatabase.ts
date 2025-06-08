import { Job } from '../types/Job'
import { client } from '../discord/client'
import fs from 'fs'
import log from 'loglevel'
import { TextChannel } from 'discord.js'
import path from 'path'
import { config } from '../config/loader'

const BACKUP_CHAT_ID = '1363547820493242428'

const backupDatabase: Job = {
  name: 'Backup Database',
  interval: '0 */2 * * *',
  execute: async () => {
    log.info('[BACKUP] Backing up database')

    if (!config.discordModuleEnabled) {
      log.error('[BACKUP] Discord module not enabled')
      return
    }

    const channel = await client.channels.fetch(BACKUP_CHAT_ID)
    if (!channel || !channel.isTextBased()) {
      log.error('[BACKUP] Backup chat not found')
      return
    }

    let file = fs.readFileSync(path.join(__dirname, '../storage/db.sqlite3'))
    const fileName = `db-backup-${new Date().toISOString()}.sqlite3`
    let backupChannel = client.channels.cache.get(BACKUP_CHAT_ID) as TextChannel
    backupChannel.send({
      content: '',
      files: [
        {
          name: fileName,
          attachment: file
        }
      ]
    })

    log.info('[BACKUP] Database backup sent')
  }
}

export default backupDatabase
