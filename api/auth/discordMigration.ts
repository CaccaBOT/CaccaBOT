import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'

import { client } from '../../discord/client'
import { config } from '../../config/loader'
import { authenticate } from '../../middleware/auth'
import { setDiscordId } from '../../database'

interface Params {
	code: string
}

const VERIFIED_ROLE_ID = '1229787263332909066'

const discordMigrationEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get(
		'/discord/migration',
		async (req: FastifyRequest<{ Querystring: Params }>, res: FastifyReply) => {
			const user = await authenticate(req, res)

			const { code } = req.query

			if (!code) {
				return res.code(400).send({ error: 'No code provided' })
			}

			let redirectUri = null

			if (process.env.ENVIRONMENT === 'production') {
				redirectUri = `${config.serverUrl}/auth/discord`
			} else {
				redirectUri = `http://localhost:5173/auth/discord`
			}

			const authTokenResponse = await fetch(
				'https://discord.com/api/oauth2/token',
				{
					method: 'POST',
					body: new URLSearchParams({
						client_id: client.user!.id,
						client_secret: process.env.DISCORD_OAUTH_TOKEN!,
						code,
						grant_type: 'authorization_code',
						redirect_uri: redirectUri,
						scope: 'identify',
					}).toString(),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			)

			const oauthData = await authTokenResponse.json()

			const userInfoResponse = await fetch(
				'https://discord.com/api/users/@me',
				{
					headers: {
						authorization: `Bearer ${oauthData.access_token}`,
					},
				},
			)

			const userData = await userInfoResponse.json()

			setDiscordId(user.id, userData.id)

			await fetch(
				`https://discord.com/api/v10/guilds/1229739123770785792/members/${userData.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
					},
					body: JSON.stringify({
						access_token: oauthData.access_token,
						roles: [VERIFIED_ROLE_ID],
						nick: user.username,
					}),
				},
			)

			res.code(200).send(userData)
		},
	)
}

export default discordMigrationEndpoint
