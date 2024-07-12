const {
    updateProfilePicture
} = require('../../database')
const { authenticate } = require('../../middleware/auth')

module.exports = async function (fastify, options) {
    fastify.delete('/pfp', async (req, res) => {
        const user = await authenticate(req, res)
        updateProfilePicture(user.id, null)
        res.code(200).send()
    })
}
