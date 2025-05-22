import { Command, Info } from '../types/Command'
import { poopStats } from '../database'
import { Message } from 'whatsapp-web.js'

const stats: Command = {
  name: 'stats',
  description: 'see stats about poop',
  execute: async (message: Message, info: Info) => {
    let stats = poopStats()
    let statsMsg = `*Time*  | *Count*\n`
    for (const stat of Object.entries(stats)) {
      statsMsg += `${stat[0].padEnd(5)} | ${stat[1]}\n`
    }
    message.reply(statsMsg)
  }
}

export default stats
