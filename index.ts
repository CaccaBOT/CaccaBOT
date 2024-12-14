const server = require('fastify')({
	bodyLimit: 8388608,
	http2: process.env.ENVIRONMENT == 'production',
})
import { FastifyRequest, FastifyReply } from 'fastify'
import { client } from './whatsapp/index'
import { initDatabase } from './database/index'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import fastifyStatic from '@fastify/static'
import { version } from './package.json'
//@ts-ignore
import schedule from 'node-schedule'
import { config, loadConfig } from './config/loader'
dotenv.config()
loadConfig()

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

console.log(
	`Loaded the following configuration for environment ${process.env.ENVIRONMENT}`,
)
console.log(config)

server.register(require('@fastify/swagger'), {
	swagger: {
		info: {
			title: 'CaccaBOT API',
			description: 'CaccaBOT API Documentation',
			version,
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
		onRequest: function (
			request: FastifyRequest,
			reply: FastifyReply,
			next: () => void,
		) {
			next()
		},
		preHandler: function (
			request: FastifyRequest,
			reply: FastifyReply,
			next: () => void,
		) {
			next()
		},
	},
})

server.register(import('@fastify/autoload'), {
	dir: `${__dirname}/api`,
	dirNameRoutePrefix: true,
	options: { prefix: '/api' },
})

server.addHook('onRoute', (routeOptions: { url: string; method: string }) => {
	if (routeOptions.url.startsWith('/api') && routeOptions.method != 'HEAD') {
		console.log(`[ENDPOINT] ${routeOptions.method} ${routeOptions.url}`)
	}
})

server.register(import('@fastify/compress'))

server.register(fastifyStatic, {
	root: path.join(__dirname, 'public'),
	prefix: '/public',
})

server.register(fastifyStatic, {
	root: path.join(__dirname, '/public/client'),
	prefix: '/',
	decorateReply: false,
})

server.register(fastifyStatic, {
	root: path.join(__dirname, '/public/client/assets'),
	prefix: '/assets/',
	decorateReply: false,
})

server.register(fastifyStatic, {
	root: path.join(__dirname, '/public/collectibles'),
	prefix: '/collectibles/',
	decorateReply: false,
	maxAge: '1d',
	immutable: true,
})

server.register(fastifyStatic, {
	root: path.join(__dirname, '/public/pfp'),
	prefix: '/pfp/',
	decorateReply: false,
})

server.register(import('@fastify/cors'), {
	origin: '*',
})

server.addHook(
	'onRequest',
	(req: { method: any; url: any }, res: any, done: () => void) => {
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
	},
)

server.decorate('NotFound', (req: FastifyRequest, res: FastifyReply) => {
	if (req.url.toLowerCase().startsWith('/api')) {
		res.code(404).send({ error: 'This endpoint does not exist' })
	}

	const stream = fs.createReadStream(`${__dirname}/public/client/index.html`)
	res.type('text/html').send(stream)
})

server.setNotFoundHandler(server.NotFound)

if (config.whatsappModuleEnabled) {
	client.initialize()
}

async function initJobs() {
	const jobsDir = fs
		.readdirSync(`${path.resolve('./jobs')}`)
		.filter((file) => file.endsWith('.ts'))

	for (const jobFile of jobsDir) {
		const job = await import(`${path.resolve('./jobs')}/${jobFile}`)
		schedule.scheduleJob(job.default.interval, job.default.execute)
		console.info(`[JOB] ${job.default.interval} => ${job.default.name}`)
	}
}

server.listen(
	{ host: '0.0.0.0', port: process.env.SERVER_PORT ?? 3000 },
	async (err: any, address: string) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		initDatabase()
		await initJobs()
		if (config.monthlyPurge) {
			console.warn(
				'[WARNING] Monthly Purge is enabled, users who have been ' +
					'inactive for more than a month will be deleted at month reset!',
			)
		}
		console.log('[WEBSERVER] Ready on ' + address)
	},
)
