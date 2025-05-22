import fs from 'fs'
import path from 'path'
import { Config } from '../types/Config'
import dotenv from 'dotenv'
import log, { RootLogger } from 'loglevel'
import moment from 'moment'

export let isLoaded = false

export let config: Config = {
  name: '',
  description: '',
  prefix: '',
  serverUrl: '',
  groupId: '',
  guildId: '',
  whatsappModuleEnabled: false,
  discordModuleEnabled: false,
  monthlyPurge: false,
  timezone: '',
  loglevel: '',
  logMessages: false
}

export function loadConfig() {
  dotenv.config()
  try {
    switch (process.env.ENVIRONMENT) {
      case 'dev':
        config = JSON.parse(
          fs.readFileSync(path.join('./config', 'config_dev.json'), 'utf-8')
        )
        break
      case 'production':
        config = JSON.parse(
          fs.readFileSync(path.join('./config', 'config_prod.json'), 'utf-8')
        )
        break
      default:
        printErrorBanner()
        log.error(
          '[ENVIRONMENT] The application cannot start because no valid environment has been specified'
        )
        process.exit(1)
    }
    configureLogger(log)
  } catch (e) {
    printErrorBanner()
    log.error(
      '[CONFIG] The application cannot start because the configuration file was not found'
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

function configureLogger(log: RootLogger) {
  const logDir = path.join(__dirname, '..', 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }
  const logFile = path.join(
    logDir,
    `${moment().tz(config.timezone).format('YYYY-MM-DD')}.log`
  )

  log.setLevel(config.loglevel as log.LogLevelDesc)
  let originalFactory = log.methodFactory
  log.methodFactory = (methodName, logLevel, loggerName) => {
    let rawMethod = originalFactory(methodName, logLevel, loggerName)

    return (message) => {
      let logMessage: any = null
      if (typeof message == 'object' && message != null) {
        logMessage = JSON.stringify(message, null, 2)
        rawMethod(logMessage)
        fs.appendFileSync(logFile, logMessage + '\n')
      } else {
        logMessage = `${moment().tz(config.timezone).format('YYYY-MM-DDTHH:mm:ss')} | ${methodName.toUpperCase()} | ${message}`
        rawMethod(logMessage)
        fs.appendFileSync(logFile, logMessage + '\n')
      }
    }
  }
  log.rebuild()
}
