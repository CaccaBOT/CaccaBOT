import fs from 'fs'
import path from 'path'
import { Config } from '../types/Config'
import dotenv from 'dotenv'
import log from 'loglevel'

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
	loglevel: '',
}

export function loadConfig() {
	dotenv.config()
	try {
		switch (process.env.ENVIRONMENT) {
			case 'dev':
				config = JSON.parse(
					fs.readFileSync(path.join('./config', 'config_dev.json'), 'utf-8'),
				)
				break
			case 'production':
				config = JSON.parse(
					fs.readFileSync(path.join('./config', 'config_prod.json'), 'utf-8'),
				)
				break
			default:
				printErrorBanner()
				log.error(
					'[ENVIRONMENT] The application cannot start because no valid environment has been specified',
				)
				process.exit(1)
		}
		log.setLevel(config.loglevel as log.LogLevelDesc)
	} catch (e) {
		printErrorBanner()
		log.error(
			'[CONFIG] The application cannot start because the configuration file was not found',
		)
		process.exit(1)
	}
}

function printErrorBanner() {
	log.error()
	log.error('███████ ██████  ██████   ██████  ██████  ')
	log.error('██      ██   ██ ██   ██ ██    ██ ██   ██ ')
	log.error('█████   ██████  ██████  ██    ██ ██████  ')
	log.error('██      ██   ██ ██   ██ ██    ██ ██   ██ ')
	log.error('███████ ██   ██ ██   ██  ██████  ██   ██ ')
	log.error()
}
