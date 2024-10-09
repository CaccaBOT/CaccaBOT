import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RouteOptions,
} from 'fastify'
import {
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
} from '../../database/index'
import moment from 'moment-timezone'
import config from '../../config.json'
const timezone = config.timezone || 'UTC'

const statsAllEndpoint = async function (
	server: FastifyInstance,
	options: RouteOptions,
) {
	server.get('/stats', async (req: FastifyRequest, res: FastifyReply) => {
		const date = moment
			.tz(moment(), timezone)
			.startOf('day')
			.clone()
			.toISOString()

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

export default statsAllEndpoint
