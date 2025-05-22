import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from 'fastify'

import { client } from '../../discord/client'
import { config } from '../../config/loader'
import { authenticate } from '../../middleware/auth'
import { getUserByDiscordId, setDiscordId } from '../../database'

interface Params {
  code: string
}

const discordLoginEndpoint = async function (
  server: FastifyInstance,
  options: RouteOptions
) {
  server.get(
    '/discord',
    async (req: FastifyRequest<{ Querystring: Params }>, res: FastifyReply) => {
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
            scope: 'identify'
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      const oauthData = await authTokenResponse.json()

      const userInfoResponse = await fetch(
        'https://discord.com/api/users/@me',
        {
          headers: {
            authorization: `Bearer ${oauthData.access_token}`
          }
        }
      )

      const userData = await userInfoResponse.json()

      const user = await getUserByDiscordId(userData.id)

      if (!user) {
        return res.code(404).send({ error: 'User not found' })
      }

      res.code(200).send(user)
    }
  )
}

export default discordLoginEndpoint
