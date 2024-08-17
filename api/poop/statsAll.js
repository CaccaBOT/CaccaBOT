const {
	getUserCount,
	getMonthlyUserCount,
	getCirculatingMoney,
	getCirculatingMoneyWithAssets,
	getDailyPoopCount,
	getWeeklyPoopCount,
	getMonthlyPoopCount,
	getTotalPoopCount,
	getDailyTopPooper,
	getWeeklyTopPooper,
	getMonthlyTopPooper,
	getTopPooper,
	getMonthlyPoopDistribution,
	getTotalPoopsPerDay,
} = require('../../database/index')

module.exports = async function (fastify, options) {
	fastify.get('/stats', async (req, res) => {
		const date = new Date().toISOString().split('T')[0]
		const users = {
			total: getUserCount(),
			monthly: getMonthlyUserCount(date),
		}
		const economy = {
			circulatingMoney: getCirculatingMoney(),
			circulatingMoneyWithAssets: getCirculatingMoneyWithAssets(),
		}
		const poopStats = {
			daily: getDailyPoopCount(date),
			weekly: getWeeklyPoopCount(date),
			monthly: getMonthlyPoopCount(date),
			total: getTotalPoopCount(),
		}
		const topPoopers = {
			daily: getDailyTopPooper(date),
			weekly: getWeeklyTopPooper(date),
			monthly: getMonthlyTopPooper(date),
			total: getTopPooper(),
		}
		const distribution = getMonthlyPoopDistribution(date)
		const poopsPerDay = getTotalPoopsPerDay()

		res.code(200).send({
			users,
			economy,
			poopStats,
			topPoopers,
			distribution,
			poopsPerDay,
		})
	})
}
