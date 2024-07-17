const {
    setMoney,
    getRarities
} = require('../../database')
const { authenticate } = require('../../middleware/auth')

module.exports = async function (fastify, options) {
    fastify.get('/open', async (req, res) => {
        const user = await authenticate(req, res)

        if (user.money < 5) {
            res.code(403).send({error: 'You can\'t afford this item'})
        }

        setMoney(user.id, user.money - 5)
        const rarities = getRarities()
        const rarity = pickRarity(rarities)
        // extract one card of such rarity from the DB
        // assign the card to the user
        res.code(200).send()
    })
}

function pickRarity(rarities) {
    const randomChance = Math.random() * 100;
    let runningSum = 0;

    for (const rarity of rarities) {
        runningSum += rarity.chance;
        if (randomChance < runningSum) {
            return rarity;
        }
    }
}