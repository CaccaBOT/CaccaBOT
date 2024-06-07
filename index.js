const path = require('path')
const server = require('fastify')()
const { client } = require('./whatsapp/index')
const fs = require('fs')
const dotenv = require('dotenv')
const config = require('./config.json')
dotenv.config()

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
		onRequest: function (request, reply, next) {
			next()
		},
		preHandler: function (request, reply, next) {
			next()
		},
	},
})

server.register(require('@fastify/autoload'), {
	dir: `${__dirname}/api`,
	dirNameRoutePrefix: true,
	options: { prefix: '/api' },
})

server.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public'),
})

server.register(require('@fastify/cors'), {
	origin: '*',
})

server.decorate('NotFound', (req, res) => {
	if (req.url.toLowerCase().startsWith('/api')) {
		res.send({error: 'This endpoint does not exist'}).code(404)
	}
	const stream = fs.createReadStream(`${__dirname}/public/index.html`)
	res.type('text/html').send(stream)
})

server.setNotFoundHandler(server.NotFound)

client.initialize()

server.listen(
	{ host: '0.0.0.0', port: process.env.SERVER_PORT ?? 3000 },
	async (err, address) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		console.log('[READY] CaccaBOT on ' + address)
	}
)
