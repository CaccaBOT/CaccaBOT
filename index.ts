const server = require('fastify')({ bodyLimit: 8388608 })
import {FastifyRequest, FastifyReply} from 'fastify'
import { client } from './whatsapp/index'
import { initDatabase } from './database/index'
import dotenv from 'dotenv'
import config from './config.json'
import fs from 'fs'
import path from 'path'
dotenv.config()

console.log(`
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
`)

console.log('Loaded the following configuration')
console.log(config)

server.register(require('@fastify/swagger'), {
	swagger: {
		info: {
			title: 'CaccaBOT API',
			description: 'CaccaBOT API Documentation',
			version: config.version,
		},
		host: `caccabot.duckdns.org`,
		schemes: ['https'],
		consumes: ['application/json'],
		produces: ['application/json'],
	},
})

server.register(require('@fastify/swagger-ui'), {
	routePrefix: '/docs',
	uiConfig: {
		deepLinking: false,
		syntaxHighlight: {
			activate: true,
			theme: 'nord',
		},
	},
	uiHooks: {
		onRequest: function (request: FastifyRequest, reply: FastifyReply, next: () => void) {
			next()
		},
		preHandler: function (request: FastifyRequest, reply: FastifyReply, next: () => void) {
			next()
		},
	},
})

server.register(require('@fastify/autoload'), {
	dir: `${__dirname}/api`,
	dirNameRoutePrefix: true,
	options: { prefix: '/api' },
})

server.addHook('onRoute', (routeOptions: { url: string; method: string }) => {
	if (routeOptions.url.startsWith('/api') && routeOptions.method != 'HEAD') {
		console.log(`[ENDPOINT] ${routeOptions.method} ${routeOptions.url}`)
	}
})

server.register(require('@fastify/static'), {
	root: path.join(__dirname, '/public'),
	prefix: '/public/',
})

server.register(require('@fastify/cors'), {
	origin: '*',
})

server.addHook('onRequest', (req: { method: any; url: any }, res: any, done: () => void) => {
	const log = `${new Date().toISOString()} | ${req.method} | ${req.url}`
	if (!fs.existsSync(`${__dirname}/logs`)) {
		fs.mkdirSync(`${__dirname}/logs`)
	}
	fs.appendFileSync(
		`${__dirname}/logs/${new Date().toISOString().slice(0, 10)}.log`,
		`${log}\n`,
	)
	console.info(log)
	done()
})

server.decorate('NotFound', (req: FastifyRequest, res: FastifyReply) => {
	if (req.url.toLowerCase().startsWith('/api')) {
		res.code(404).send({ error: 'This endpoint does not exist' })
	} else if (req.url.toLowerCase().startsWith('/public')) {
		res.code(404).send('File does not exist')
	}

	res.redirect(`${config.frontendUrl}${req.url}`)
})

server.setNotFoundHandler(server.NotFound)

if (config.whatsappModuleEnabled) {
	client.initialize()
}

server.listen(
	{ host: '0.0.0.0', port: process.env.SERVER_PORT ?? 3000 },
	async (err: any, address: string) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		initDatabase()
		console.log('[WEBSERVER] Ready on ' + address)
	},
)