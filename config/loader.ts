import fs from 'fs';
import path from 'path'
import { Config } from '../types/Config'

export let config: Config = {
    name: '',
    description: '',
    prefix: '',
    serverUrl: '',
    groupId: '',
    whatsappModuleEnabled: false,
    monthlyPurge: false,
    timezone: ''
};

export function loadConfig() {
    switch (process.env.ENVIRONMENT) {
        case 'dev':
            config = JSON.parse(fs.readFileSync(path.join('./config', 'config_dev.json'), 'utf-8'))
            break
        case 'production':
            config = JSON.parse(fs.readFileSync(path.join('./config', 'config_prod.json'), 'utf-8'))
            break
        default:
            console.error()
            console.error("███████ ██████  ██████   ██████  ██████  ")
            console.error("██      ██   ██ ██   ██ ██    ██ ██   ██ ")
            console.error("█████   ██████  ██████  ██    ██ ██████  ")
            console.error("██      ██   ██ ██   ██ ██    ██ ██   ██ ")
            console.error("███████ ██   ██ ██   ██  ██████  ██   ██ ")
            console.error()
            console.error(
                "[ENVIRONMENT] The application cannot start because no valid environment has been specified"
            )
            process.exit(1)
    }
}