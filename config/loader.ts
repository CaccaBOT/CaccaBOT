import fs from 'fs'
import path from 'path'
import { Config } from '../types/Config'

export let isLoaded = false

export let config: Config = {
	name: '',
	description: '',
	prefix: '',
	serverUrl: '',
	groupId: '',
	whatsappModuleEnabled: false,
	monthlyPurge: false,
	timezone: '',
}

export function loadConfig() {
	try {
		switch (process.env.ENVIRONMENT) {
			case 'dev':
				config = JSON.parse(
					fs.readFileSync(path.join('./config', 'config_dev.json'), 'utf-8'),
				)
				isLoaded = true
				break
			case 'production':
				config = JSON.parse(
					fs.readFileSync(path.join('./config', 'config_prod.json'), 'utf-8'),
				)
				isLoaded = true
				break
			default:
				printErrorBanner()
				console.error(
					'[ENVIRONMENT] The application cannot start because no valid environment has been specified',
				)
				process.exit(1)
		}
	} catch (e) {
		printErrorBanner()
		console.error(
			'[CONFIG] The application cannot start because the configuration file was not found',
		)
	}
}

function printErrorBanner() {
	console.error()
	console.error('███████ ██████  ██████   ██████  ██████  ')
	console.error('██      ██   ██ ██   ██ ██    ██ ██   ██ ')
	console.error('█████   ██████  ██████  ██    ██ ██████  ')
	console.error('██      ██   ██ ██   ██ ██    ██ ██   ██ ')
	console.error('███████ ██   ██ ██   ██  ██████  ██   ██ ')
	console.error()
}
