const { getUserCollectibles } = require('../../database')

module.exports = async function (fastify, options) {
    fastify.get('/inventory/:id', async (req, res) => {
        const id = req.params['id']
        const collectibles = getUserCollectibles(id)
        res.code(200).send(collectibles)
    })
}