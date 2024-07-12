const {
    updateProfilePicture
} = require('../../database')
const { authenticate } = require('../../middleware/auth')
const fs = require('fs')
const path = require('path')

module.exports = async function (fastify, options) {
    fastify.post('/pfp', async (req, res) => {
        const { image } = req.body
        const user = await authenticate(req, res)

        if (!image || typeof image !== 'string') {
            return res.status(400).send({ error: 'Invalid image data' })
        }

        const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)
        if (!matches || matches.length !== 3) {
            return res.status(400).send({ error: 'Invalid image format' })
        }

        const ext = matches[1]
        const base64Data = matches[2]
        const buffer = Buffer.from(base64Data, 'base64')

        const filename = `${user.id}.${ext}`
        const dirPath = path.join(__dirname, '../../public/pfp')
        const filePath = path.join(dirPath, filename)

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }

        fs.writeFileSync(filePath, buffer)

        const imageUrl = `http://localhost:3000/public/pfp/${filename}`
        updateProfilePicture(user.id, imageUrl)

        return res.send({ url: imageUrl })
    })
}
