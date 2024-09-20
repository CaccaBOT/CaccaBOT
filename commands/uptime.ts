import { Command } from "../types/Command"

import { exec } from 'child_process'

const uptime: Command = {
	name: 'uptime',
	description: 'see info about the host uptime',
	execute: async (message, info) => {
		//@ts-ignore
		exec('uptime', (error, stdout, stderr) => {
			message.reply(stdout)
		})
	},
}

export default uptime;