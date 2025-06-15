// TODO: update logic of market/index.ts/executeTransaction to not need the export
export const db = require('better-sqlite3')('./storage/db.sqlite3')
import crypto from 'crypto'
import moment from 'moment-timezone'
import fs from 'fs'
import path from 'path'
import { Migration } from '../types/Migration'
import { config } from '../config/loader'
import { UserCollectible } from '../types/UserCollectible'
import { Collectible } from '../types/Collectible'
import { Order } from '../types/Order'
import { OrderType, OrderSide } from '../types/OrderEnums'
import log from 'loglevel'
import { MarketPriceHistory } from '../types/MarketPriceHistory'
import { CollectibleOwnership } from '../types/CollectibleOwnership'
import { Rarity } from '../types/Rarity'
import { RawUser } from '../types/User'

const timezone = config.timezone

export function initDatabase() {
  const migrationFiles = fs
    .readdirSync(path.join(__dirname, './migrations'))
    .sort(
      (a, b) => parseInt(a.split('-')[0], 10) - parseInt(b.split('-')[0], 10)
    )

  let executedMigrations: Migration[] = []

  try {
    executedMigrations = [...db.prepare(`SELECT * FROM _migration`).all()]
  } catch (e) {}

  if (executedMigrations.length === 0) {
    log.info(`[DATABASE] Database is uninitialized, all migrations will be run`)
  }

  for (const file of migrationFiles) {
    if (!executedMigrations.find((m) => m.filename === file)) {
      log.info(`[DATABASE] Running migration ${file}`)
      const migration = fs.readFileSync(
        path.join(__dirname, `./migrations/${file}`),
        'utf-8'
      )
      db.exec(migration)
      db.prepare(
        `INSERT INTO _migration(filename, timestamp) VALUES(?, ?)`
      ).run(file, new Date().toISOString())
    }
  }
}

export function getHistoricalMarketDays(collectibleId: number) {
  return db
    .prepare(`SELECT * FROM market_price_history WHERE collectible_id = ?`)
    .all(collectibleId)
}

export function getPoop(poopId: number) {
  return db.prepare(`SELECT * FROM poop WHERE id = ?`).get(poopId)
}

export function deletePoop(poopId: number) {
  const poop = db.prepare(`SELECT * FROM poop WHERE id = ?`).get(poopId)

  db.prepare(`DELETE FROM poop WHERE id = ?`).run(poopId)

  db.prepare(
    `UPDATE user SET money = (SELECT money FROM user WHERE id = ?) - 1 WHERE id = ?`
  ).run(poop.user_id, poop.user_id)
}

export function getCollectible(collectibleId: number) {
  return db.prepare(`SELECT * FROM collectible WHERE id = ?`).get(collectibleId)
}

export function getCollectibleOwnerships(userId: string): UserCollectible[] {
  const userCollectibles = db
    .prepare(`SELECT * FROM user_collectible WHERE user_id = ?`)
    .all(userId)

  for (const userCollectible of userCollectibles) {
    if (userCollectible) {
      userCollectible.selling = Boolean(userCollectible.selling)
    }
  }

  return userCollectibles
}

export function getCollectibleOwnershipById(
  userCollectibleId: number
): UserCollectible {
  const userCollectible = db
    .prepare(`SELECT * FROM user_collectible WHERE id = ?`)
    .get(userCollectibleId)

  if (userCollectible)
    userCollectible.selling = Boolean(userCollectible.selling)

  return userCollectible
}

export function setCollectibleOwnershipUser(
  userCollectibleId: number,
  userId: string
) {
  db.prepare('UPDATE user_collectible SET user_id = ? WHERE id = ?').run(
    userId,
    userCollectibleId
  )
}

export function deleteUserCollectible(userCollectibleId: number) {
  db.prepare(`DELETE FROM user_collectible WHERE id = ?`).run(userCollectibleId)
}

export function isUserAdmin(userId: string) {
  return db.prepare(`SELECT admin FROM user WHERE id = ?`).get(userId).admin
}

export function setUserAdmin(userId: string, admin: boolean) {
  db.prepare(`UPDATE user SET admin = ? WHERE id = ?`).run(admin, userId)
}

export function getAllUsers() {
  return db
    .prepare(`SELECT id, username, pfp, openedPacks, money, frozen FROM user`)
    .all()
}

export function getPoops(limit: number, offset: number) {
  return db
    .prepare(
      `
		SELECT *
		FROM poop
		ORDER BY timestamp DESC
		LIMIT ? OFFSET ?
		`
    )
    .all(limit, offset)
}

export function getAchievement(achievementId: string) {
  return db.prepare(`SELECT * FROM achievement WHERE id = ?`).get(achievementId)
}

export function getInactiveUsers(date: Date) {
  const startOfMonth = moment(date).startOf('month').utc().toISOString()
  const endOfMonth = moment(date).endOf('month').utc().toISOString()

  const inactiveUsers = db
    .prepare(
      `
        SELECT u.*
        FROM user u 
        WHERE NOT EXISTS (
            SELECT 1 
            FROM poop p 
            WHERE p.user_id = u.id 
            AND p.timestamp BETWEEN ? AND ?
        )
    `
    )
    .all(startOfMonth, endOfMonth)

  return inactiveUsers
}

export function deleteUser(userId: string) {
  db.prepare(`DELETE FROM user WHERE id = ?`).run(userId)
}

export function updateUsername(userId: string, username: string) {
  db.prepare(`UPDATE user SET username = ? WHERE id = ?`).run(username, userId)
}

export function getTotalPoopsPerDay() {
  return db
    .prepare(
      `
			WITH RECURSIVE date_series(date) AS (
				SELECT MIN(DATE(timestamp)) 
				FROM poop
				UNION ALL
				SELECT DATE(date, '+1 day')
				FROM date_series
				WHERE date < (SELECT MAX(DATE(timestamp)) FROM poop)
			)
			SELECT 
				date_series.date as date, 
				COALESCE(COUNT(p.id), 0) as poops
			FROM 
				date_series
			LEFT JOIN 
				poop p 
			ON 
				date_series.date = DATE(p.timestamp)
			GROUP BY 
				date_series.date
			ORDER BY 
				date_series.date
			`
    )
    .all()
    .reduce(
      (
        acc: Record<string, number>,
        { date, poops }: Record<string, number>
      ) => {
        acc[date] = poops
        return acc
      },
      {}
    )
}

export function getUserCount() {
  return db.prepare(`SELECT COUNT(*) as totalUsers FROM user`).get().totalUsers
}

export function getMonthlyUserCount(date: string) {
  const startOfMonth = moment(date).startOf('month').utc().toISOString()
  const endOfMonth = moment(date).endOf('month').utc().toISOString()

  return db
    .prepare(
      `
			SELECT COUNT(DISTINCT u.id) as monthlyUsers
			FROM user u
			JOIN poop p ON u.id = p.user_id
			WHERE p.timestamp BETWEEN ? AND ?
		`
    )
    .get(startOfMonth, endOfMonth).monthlyUsers
}

export function getCirculatingMoney() {
  return db.prepare(`SELECT SUM(money) as circulatingMoney FROM user`).get()
    .circulatingMoney
}

export function getCirculatingMoneyWithAssets() {
  return db
    .prepare(
      `SELECT 
                COALESCE(SUM(u.money), 0) + 
                COALESCE(SUM(user_collectible_count * 5), 0) AS circulatingMoneyWithAssets
            FROM user u
            LEFT JOIN (
                SELECT user_id, COUNT(id) AS user_collectible_count
                FROM user_collectible
                GROUP BY user_id
            ) uc ON u.id = uc.user_id`
    )
    .get().circulatingMoneyWithAssets
}

export function getDailyPoopCount(date: string) {
  const startOfDay = moment(date).startOf('day').clone().toISOString()
  const endOfDay = moment(date).endOf('day').clone().toISOString()

  const currentCount = db
    .prepare(
      `
            SELECT COUNT(*) AS dailyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `
    )
    .get(startOfDay, endOfDay).dailyPoops

  const previousStartOfDayUTC = moment(startOfDay)
    .subtract(1, 'day')
    .toISOString()
  const previousEndOfDayUTC = moment(endOfDay).subtract(1, 'day').toISOString()

  const previousCount = db
    .prepare(
      `
            SELECT COUNT(*) AS previousDailyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `
    )
    .get(previousStartOfDayUTC, previousEndOfDayUTC).previousDailyPoops

  const trend =
    previousCount > 0
      ? ((currentCount - previousCount) / previousCount) * 100
      : currentCount > 0
        ? 100
        : 0

  return { poops: currentCount, trend: Math.round(trend) }
}

export function getWeeklyPoopCount(date: string) {
  const startOfCurrentWeekUTC = moment(date)
    .isoWeekday(1)
    .startOf('day')
    .clone()
    .utc()
    .toISOString()

  const endOfCurrentWeekUTC = moment(date)
    .isoWeekday(7)
    .endOf('day')
    .clone()
    .utc()
    .toISOString()

  const startOfPreviousWeekUTC = moment(date)
    .subtract(1, 'week')
    .isoWeekday(1)
    .startOf('day')
    .clone()
    .utc()
    .toISOString()

  const endOfPreviousWeekUTC = moment(date)
    .subtract(1, 'week')
    .isoWeekday(7)
    .endOf('day')
    .clone()
    .utc()
    .toISOString()

  const currentCount = db
    .prepare(
      `
            SELECT COUNT(*) AS weeklyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `
    )
    .get(startOfCurrentWeekUTC, endOfCurrentWeekUTC).weeklyPoops

  const previousCount = db
    .prepare(
      `
            SELECT COUNT(*) AS previousWeeklyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `
    )
    .get(startOfPreviousWeekUTC, endOfPreviousWeekUTC).previousWeeklyPoops

  const trend =
    previousCount > 0
      ? ((currentCount - previousCount) / previousCount) * 100
      : currentCount > 0
        ? 100
        : 0

  return { poops: currentCount, trend: Math.round(trend) }
}

export function getMonthlyPoopCount(date: string) {
  const startOfCurrentMonth = moment(date)
    .startOf('month')
    .clone()
    .utc()
    .toISOString()
  const endOfCurrentMonth = moment(date)
    .endOf('month')
    .clone()
    .utc()
    .toISOString()
  const startOfPreviousMonth = moment(date)
    .subtract(1, 'month')
    .startOf('month')
    .clone()
    .utc()
    .toISOString()
  const endOfPreviousMonth = moment(date)
    .subtract(1, 'month')
    .endOf('month')
    .clone()
    .utc()
    .toISOString()

  const currentCount = db
    .prepare(
      `
            SELECT COUNT(*) AS monthlyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `
    )
    .get(startOfCurrentMonth, endOfCurrentMonth).monthlyPoops

  const previousCount = db
    .prepare(
      `
            SELECT COUNT(*) AS previousMonthlyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `
    )
    .get(startOfPreviousMonth, endOfPreviousMonth).previousMonthlyPoops

  const trend =
    previousCount > 0
      ? ((currentCount - previousCount) / previousCount) * 100
      : currentCount > 0
        ? 100
        : 0

  return { poops: currentCount, trend: Math.round(trend) }
}

export function getTotalPoopCount() {
  return db
    .prepare(
      `
	SELECT COUNT(*) AS poops
	FROM poop
	`
    )
    .get()
}

export function getDailyTopPooper(date: string) {
  const startOfDay = moment(date).startOf('day').utc().toISOString()
  const endOfDay = moment(date).endOf('day').utc().toISOString()

  return db
    .prepare(
      `
        SELECT u.id, u.username, u.pfp, COUNT(p.id) as poops
        FROM user u
        JOIN poop p ON u.id = p.user_id
        WHERE p.timestamp BETWEEN ? AND ?
        GROUP BY u.id
        ORDER BY poops DESC
        LIMIT 1
    `
    )
    .get(startOfDay, endOfDay)
}

export function getWeeklyTopPooper(date: string) {
  const startOfWeek = moment(date)
    .isoWeekday(1)
    .startOf('day')
    .utc()
    .toISOString()
  const endOfWeek = moment(date).isoWeekday(7).endOf('day').utc().toISOString()

  return db
    .prepare(
      `
        SELECT u.id, u.username, u.pfp, COUNT(p.id) as poops
        FROM user u
        JOIN poop p ON u.id = p.user_id
        WHERE DATE(p.timestamp) BETWEEN ? AND ?
        GROUP BY u.id
        ORDER BY poops DESC
        LIMIT 1
    `
    )
    .get(startOfWeek, endOfWeek)
}

export function getMonthlyTopPooper(date: string) {
  const startOfMonth = moment(date).startOf('month').utc().toISOString()
  const endOfMonth = moment(date).endOf('month').utc().toISOString()

  return db
    .prepare(
      `
        SELECT u.id, u.username, u.pfp, COUNT(p.id) as poops
        FROM user u
        JOIN poop p ON u.id = p.user_id
        WHERE p.timestamp BETWEEN ? AND ?
        GROUP BY u.id
        ORDER BY poops DESC
        LIMIT 1
    `
    )
    .get(startOfMonth, endOfMonth)
}

export function getTopPooper() {
  return db
    .prepare(
      `
        SELECT u.id, u.username, u.pfp, COUNT(p.id) as poops
        FROM user u
        JOIN poop p ON u.id = p.user_id
        GROUP BY u.id
        ORDER BY poops DESC
        LIMIT 1
    `
    )
    .get()
}

export function getMonthlyPoopDistribution(date: string) {
  const startOfMonth = moment(date).startOf('month').utc().toISOString()
  const endOfMonth = moment(date).endOf('month').utc().toISOString()

  return db
    .prepare(
      `
            SELECT 
                u.id,
                u.username,
                u.pfp,
                ROUND((COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM poop WHERE timestamp BETWEEN ? AND ?)), 2) as percentage
            FROM user u
            JOIN poop p ON u.id = p.user_id
        	WHERE p.timestamp BETWEEN ? AND ?
            GROUP BY u.id, u.username
            ORDER BY percentage DESC
        `
    )
    .all(startOfMonth, endOfMonth, startOfMonth, endOfMonth)
}

export function logout(token: string) {
  const user = db.prepare(`SELECT * FROM user WHERE token = ?`).get(token)

  if (!user) {
    return null
  }

  generateToken(user.id)
}

export function getUserByToken(token: string) {
  const user = db.prepare(`SELECT * FROM user WHERE token = ?`).get(token)
  if (user) {
    user.frozen = Boolean(user.frozen)
    user.admin = Boolean(user.admin)
  }

  return user
}

export function generateToken(userId: string): RawUser {
  const token = crypto.randomBytes(64).toString('hex')
  return db.prepare(`UPDATE user SET token = ? WHERE id = ? RETURNING *`).get(token, userId)
}

export function createUser(discordId: string, username: string): RawUser {
  return db.prepare(`INSERT INTO user (id, username) VALUES (?, ?) RETURNING *`).get(
    discordId,
    username
  )
}

export function getUserCollectibles(userId: string) {
  // * I DON'T KNOW WHAT THIS DOES, I JUST NEED HOW TO FUCKING
  // * PUT THE selling PROPERTY
  return db
    .prepare(
      `
		SELECT 
			c.id, 
			c.name, 
			c.description, 
			c.asset_url, 
			c.rarity_id, 
			COUNT(uc.collectible_id) AS quantity, 
			SUM(CASE WHEN uc.selling = 1 THEN 1 ELSE 0 END) AS selling
		FROM collectible c
		JOIN user_collectible uc ON uc.collectible_id = c.id
		JOIN user u ON uc.user_id = u.id
		WHERE u.id = ?
		GROUP BY c.id, c.rarity_id
		ORDER BY c.rarity_id DESC
    	`
    )
    .all(userId)
}

export function setMoney(userId: string, amount: number) {
  db.prepare(`UPDATE user SET money = ? WHERE id = ?`).run(amount, userId)
}

export function addCollectibleToUser(
  userId: string,
  collectibleId: number
): CollectibleOwnership {
  return db
    .prepare(
      `INSERT INTO user_collectible(user_id, collectible_id) VALUES(?, ?) RETURNING *`
    )
    .get(userId, collectibleId)
}

export function addOpenedPack(userId: string) {
  db.prepare(
    `UPDATE user SET openedPacks = (SELECT openedPacks FROM user WHERE id = ?) + 1 WHERE id = ?`
  ).run(userId, userId)
}

export function getRarities(): Rarity[] {
  return db.prepare(`SELECT * FROM rarity`).all()
}

export function getCollectiblesOfRarity(rarityId: number) {
  return db
    .prepare(`SELECT * FROM collectible WHERE rarity_id = ?`)
    .all(rarityId)
}

export function getAllCollectibles(): Collectible[] {
  return db.prepare(`SELECT * FROM collectible`).all()
}

export function getUserProfileById(userId: string) {
  return db
    .prepare(
      'SELECT u.*, COUNT(p.id) as poops FROM user u JOIN poop p ON u.id = p.user_id WHERE u.id = ?'
    )
    .get(userId)
}

export function getUserProfileByUsername(username: string) {
  return db
    .prepare(
      'SELECT u.*, COUNT(p.id) as poops FROM user u LEFT JOIN poop p ON u.id = p.user_id WHERE u.username = ?'
    )
    .get(username)
}

export function getLastPoop() {
  return db.prepare(`SELECT * FROM poop ORDER BY id DESC LIMIT 1`).get()
}

export function addPoop(userId: string) {
  // this is voluntarily stored in UTC for best practice
  db.prepare(`INSERT INTO poop (user_id, timestamp) VALUES (?, ?)`).run(
    userId,
    new Date().toISOString()
  )

  db.prepare(
    `UPDATE user SET money = (SELECT money FROM user WHERE id = ?) + 1 WHERE id = ?`
  ).run(userId, userId)
}

export function addPoopWithTimestamp(userId: string, timestamp: string) {
  db.prepare(`INSERT INTO poop (user_id, timestamp) VALUES (?, ?)`).run(
    userId,
    timestamp
  )

  db.prepare(
    `UPDATE user SET money = (SELECT money FROM user WHERE id = ?) + 1 WHERE id = ?`
  ).run(userId, userId)
}

export function poopLeaderboard() {
  const result = db
    .prepare(
      `
            SELECT u.id, u.username, u.pfp, u.bio, u.frozen, u.money, u.admin,
                   poops,
                   ROW_NUMBER() OVER (ORDER BY poops DESC) AS rank
            FROM (
                SELECT p.user_id, 
                       COUNT(*) AS poops
                FROM poop p 
                GROUP BY p.user_id
            ) AS poops
            JOIN user u ON poops.user_id = u.id
            ORDER BY poops DESC
        `
    )
    .all()

  return result.map((row: any) => ({
    ...row,
    frozen: Boolean(row.frozen)
  }))
}

export function poopLeaderboardWithFilter(year: number, month: number) {
  const startOfMonth = moment
    .tz({ year, month: month - 1 }, timezone)
    .startOf('month')
    .utc()
    .toISOString()
  const endOfMonth = moment
    .tz({ year, month: month - 1 }, timezone)
    .endOf('month')
    .utc()
    .toISOString()

  const result = db
    .prepare(
      `
        SELECT u.id, u.username, u.pfp, u.bio, u.frozen, u.money,
               poops,
               ROW_NUMBER() OVER (ORDER BY poops DESC) AS rank
        FROM (
            SELECT p.user_id, 
                   COUNT(*) AS poops
            FROM poop p 
            WHERE p.timestamp BETWEEN ? AND ?
            GROUP BY p.user_id
        ) AS poop_counts
        JOIN user u ON poop_counts.user_id = u.id
        ORDER BY poops DESC
    `
    )
    .all(startOfMonth, endOfMonth)

  return result.map((row: any) => ({
    ...row,
    frozen: Boolean(row.frozen)
  }))
}

export function allPoop() {
  return db
    .prepare(
      'SELECT p.*, u.username as username FROM poop p JOIN user u ON p.user_id = u.id'
    )
    .all()
}

export function allPoopWithFilter(year: number, month: number) {
  const startOfMonth = moment({ year, month })
    .tz(timezone)
    .startOf('month')
    .utc()
    .toISOString()
  const endOfMonth = moment({ year, month })
    .tz(timezone)
    .endOf('month')
    .utc()
    .toISOString()

  return db
    .prepare(
      `SELECT p.*, u.username
         FROM poop p
		 JOIN user u
		 ON (p.user_id = u.id)
         WHERE p.timestamp BETWEEN ? AND ?`
    )
    .all(startOfMonth, endOfMonth)
}

export function getPoopsFromUser(userId: string) {
  return db
    .prepare(
      'SELECT p.* FROM poop p JOIN user u ON p.user_id = u.id WHERE u.id = ?'
    )
    .all(userId)
}

export function getPoopsFromUserWithFilter(
  userId: string,
  year: number,
  month: number
) {
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1))
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

  const startOfMonthIso = startOfMonth.toISOString()
  const endOfMonthIso = endOfMonth.toISOString()

  return db
    .prepare(
      `SELECT p.*
         FROM poop p
         JOIN user u ON p.user_id = u.id
         WHERE u.id = ? AND p.timestamp >= ? AND p.timestamp <= ?`
    )
    .all(userId, startOfMonthIso, endOfMonthIso)
}

export function poopStatsFromUser(userId: string) {
  const startOfDay = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .startOf('day')
    .utc()
    .toISOString()

  const endOfDay = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .endOf('day')
    .utc()
    .toISOString()

  const startOfWeek = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .startOf('week')
    .add(1, 'day')
    .startOf('day')
    .utc()
    .toISOString()

  const endOfWeek = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .startOf('week')
    .add(7, 'days')
    .subtract(1, 'second')
    .utc()
    .toISOString()

  const startOfMonth = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month()
      },
      timezone
    )
    .startOf('month')
    .utc()
    .toISOString()

  const endOfMonth = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month()
      },
      timezone
    )
    .endOf('month')
    .utc()
    .toISOString()

  const todayPoops = db
    .prepare(
      `SELECT COUNT(*) as today FROM poop WHERE timestamp BETWEEN ? AND ? AND poop.user_id = ?`
    )
    .get(startOfDay, endOfDay, userId)

  const weeklyPoops = db
    .prepare(
      `SELECT COUNT(*) as week FROM poop WHERE timestamp BETWEEN ? AND ? AND poop.user_id = ?`
    )
    .get(startOfWeek, endOfWeek, userId)

  const monthlyPoops = db
    .prepare(
      `SELECT COUNT(*) as month FROM poop WHERE timestamp BETWEEN ? AND ? AND poop.user_id = ?`
    )
    .get(startOfMonth, endOfMonth, userId)

  const totalPoops = db
    .prepare(`SELECT COUNT(*) as total FROM poop WHERE poop.user_id = ?`)
    .get(userId)

  return {
    today: todayPoops.today,
    week: weeklyPoops.week,
    month: monthlyPoops.month,
    total: totalPoops.total
  }
}

export function poopStreak(userId: string) {
  const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
  let days = db
    .prepare(
      `
			SELECT DATE(p.timestamp) as days
			FROM poop p JOIN user u ON p.user_id = u.id
			WHERE u.id = ?
			GROUP BY days
			ORDER BY days;
		`
    )
    .all(userId)
    .map((x: any) => x.days)

  days.push(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
  )

  let streak = 0

  for (let i = days.length - 1; i > 0; i--) {
    const diff = new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()
    if (diff == DAY_IN_MILLISECONDS || diff == 0) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function poopStatsFromUserWithFilter(
  userId: string,
  year: number,
  month: number
) {
  const currentDate = moment().tz(timezone)
  const isCurrentMonth =
    year == currentDate.year() && month == currentDate.month() + 1
  const daysConsidered = isCurrentMonth
    ? currentDate.date()
    : moment()
        .year(year)
        .month(month - 1)
        .endOf('month')
        .date()
  const monthlyLeaderboardPosition =
    poopLeaderboardWithFilter(year, month).find((x: any) => x.id === userId)
      ?.rank ?? 0
  const streak = poopStreak(userId)
  const monthlyPoops = getPoopsFromUserWithFilter(userId, year, month)?.length
  const poopAverage = parseFloat((monthlyPoops / daysConsidered).toFixed(2))

  return { monthlyLeaderboardPosition, streak, poopAverage, monthlyPoops }
}

export function poopStats() {
  const startOfDay = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .startOf('day')
    .utc()
    .toISOString()

  const endOfDay = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .endOf('day')
    .utc()
    .toISOString()

  const startOfWeek = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .startOf('week')
    .add(1, 'day')
    .startOf('day')
    .utc()
    .toISOString()

  const endOfWeek = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month(),
        day: moment().date()
      },
      timezone
    )
    .startOf('week')
    .add(7, 'days')
    .subtract(1, 'second')
    .utc()
    .toISOString()

  const startOfMonth = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month()
      },
      timezone
    )
    .startOf('month')
    .utc()
    .toISOString()

  const endOfMonth = moment
    .tz(
      {
        year: moment().year(),
        month: moment().month()
      },
      timezone
    )
    .endOf('month')
    .utc()
    .toISOString()

  const todayPoops = db
    .prepare(
      `SELECT COUNT(*) as today FROM poop WHERE timestamp BETWEEN ? AND ?`
    )
    .get(startOfDay, endOfDay)

  const weeklyPoops = db
    .prepare(
      `SELECT COUNT(*) as week FROM poop WHERE timestamp BETWEEN ? AND ?`
    )
    .get(startOfWeek, endOfWeek)

  const monthlyPoops = db
    .prepare(
      `SELECT COUNT(*) as month FROM poop WHERE timestamp BETWEEN ? AND ?`
    )
    .get(startOfMonth, endOfMonth)

  const totalPoops = db.prepare(`SELECT COUNT(*) as total FROM poop`).get()

  return {
    day: todayPoops.today,
    week: weeklyPoops.week,
    month: monthlyPoops.month,
    total: totalPoops.total
  }
}

export function updateProfilePicture(userId: string, imageUrl: string | null) {
  db.prepare(
    `
        UPDATE user
        SET pfp = ?
        WHERE id = ?
    `
  ).run(imageUrl, userId)
}

export function updateBio(userId: string, bio: string) {
  db.prepare(
    `
		UPDATE user
		SET bio = ?
		WHERE id = ?
	`
  ).run(bio, userId)
}

export function rawQuery(query: string) {
  if (query.toLowerCase().startsWith('select')) {
    return db.prepare(query).all()
  } else {
    return db.prepare(query).run()
  }
}

export function addAchievementToUser(userId: string, achievementId: string) {
  db.prepare(
    `INSERT INTO user_achievement (user_id, achievement_id, timestamp) VALUES (?, ?, ?)`
  ).run(userId, achievementId, new Date().toISOString())

  db.prepare(
    `UPDATE user SET money = (SELECT money FROM user WHERE id = ?) + (SELECT d.reward FROM achievement a JOIN difficulty d ON a.difficulty_id = d.id WHERE a.id = ?) WHERE id = ?`
  ).run(userId, achievementId, userId)
}

export function checkAchievementForUser(userId: string, achievementId: string) {
  return (
    db
      .prepare(
        `SELECT a.id FROM achievement a JOIN user_achievement ua ON a.id = ua.achievement_id 
		JOIN user u ON u.id = ua.user_id WHERE u.id = ? AND a.id = ?`
      )
      .get(userId, achievementId)?.id != null
  )
}

export function getUserAchievements(userId: string) {
  return db
    .prepare(
      'SELECT a.* FROM user_achievement a JOIN user u ON a.user_id = u.id WHERE u.id = ? ORDER BY a.timestamp DESC'
    )
    .all(userId)
}

export function getAllAchievements() {
  return db.prepare('SELECT a.* FROM achievement a').all()
}

// card market

export function getAllOrderSides(): OrderSide[] {
  return db.prepare(`SELECT * FROM order_side`).all()
}

export function getAllOrderTypes(): OrderType[] {
  return db.prepare(`SELECT * FROM order_type`).all()
}

// NOTE: input validations is NOT done in the following queries
// Please validate inputs before calling the methods

export function getAllOrders(): Order[] {
  const orders = db.prepare('SELECT * FROM `order`').all()

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function createOrder(
  userId: string,
  collectibleId: number,
  type: OrderType,
  side: OrderSide,
  price: number,
  quantity: number
): Order[] {
  let orders: Order[] = []
  return db.transaction(() => {
    switch (type) {
      case 'MARKET':
        {
          for (let i = 0; i < quantity; i++) {
            let order = db
              .prepare(
                'INSERT INTO `order` (user_id, collectible_id, `type`, side, creation_timestamp) VALUES (?, ?, ?, ?, ?) RETURNING *'
              )
              .get(userId, collectibleId, type, side, new Date().toISOString())
            orders.push(order)
          }
        }
        break

      default:
        {
          for (let i = 0; i < quantity; i++) {
            let order = db
              .prepare(
                'INSERT INTO `order` (user_id, collectible_id, `type`, side, price, creation_timestamp) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
              )
              .get(
                userId,
                collectibleId,
                type,
                side,
                price,
                new Date().toISOString()
              )

            orders.push(order)
          }
        }
        break
    }

    if (side == 'SELL') {
      const userCollectible = getSpecificCollectibleOwnershipsNotSelling(
        userId,
        collectibleId
      )

      for (let i = 0; i < quantity; i++)
        updateCollectibleOwnershipToSelling(userCollectible[i].id)
    }

    return orders
  })()
}

export function deleteOrder(orderId: number): boolean {
  db.prepare('DELETE from `order` WHERE id = ?').run(orderId)

  const order = getOrder(orderId)
  const userCollectible = getSpecificCollectibleOwnershipsSelling(
    order.user_id,
    order.collectible_id
  )

  if (userCollectible.length == 0) return false

  updateCollectibleOwnershipToNotSelling(userCollectible[0].id)
  return true
}

export function executeOrder(orderId: number, timestamp: Date): boolean {
  db.prepare(
    'UPDATE `order` SET executed = 1, execution_timestamp = ? WHERE id = ?'
  ).run(timestamp.toISOString(), orderId)

  return deactivateOrder(orderId)
}

export function deactivateOrder(orderId: number): boolean {
  db.prepare('UPDATE `order` SET active = 0 WHERE id = ?').run(orderId)

  const order = getOrder(orderId)

  if (order.side == 'BUY') {
    return true
  }

  const userCollectible = getSpecificCollectibleOwnershipsSelling(
    order.user_id,
    order.collectible_id
  )

  if (userCollectible.length == 0) {
    return false
  }

  updateCollectibleOwnershipToNotSelling(userCollectible[0].id)
  return true
}

export function activateOrder(orderId: number): boolean {
  db.prepare('UPDATE `order` SET active = 1 WHERE id = ?').run(orderId)

  const order = getOrder(orderId)
  const userCollectible = getSpecificCollectibleOwnershipsNotSelling(
    order.user_id,
    order.collectible_id
  )

  if (userCollectible.length == 0) return false

  updateCollectibleOwnershipToSelling(userCollectible[0].id)
  return true
}

export function updateOrderPrice(orderId: number, price: number) {
  db.prepare('UPDATE `order` set price = ? WHERE id = ?').run(price, orderId)
}

export function getOrder(orderId: number): Order {
  const order = db.prepare('SELECT * FROM `order` WHERE id = ?').get(orderId)

  if (order) {
    order.active = Boolean(order.active)
    order.executed = Boolean(order.executed)
  }

  return order
}

export function getOrdersByType(type: OrderType): Order[] {
  const orders = db.prepare('SELECT * FROM `order` WHERE type = ?').all(type)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getActiveOrdersByCollectible(collectibleId: number): Order[] {
  const orders = db
    .prepare('SELECT * FROM `order` WHERE collectible_id = ?')
    .all(collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getActiveOrdersByType(type: OrderType): Order[] {
  const orders = db
    .prepare('SELECT * FROM `order` WHERE active = 1 AND type = ?')
    .all(type)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getSellActiveOrdersByType(type: OrderType): Order[] {
  const orders = db
    .prepare(
      "SELECT * FROM `order` WHERE active = 1 AND type = ? AND side = 'SELL'"
    )
    .all(type)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getBuyActiveOrdersByType(type: OrderType): Order[] {
  const orders = db
    .prepare(
      "SELECT * FROM `order` WHERE active = 1 AND type = ? AND side = 'BUY'"
    )
    .all(type)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getSellActiveOrdersByCollectible(
  collectibleId: number
): Order[] {
  const orders = db
    .prepare(
      "SELECT * FROM `order` WHERE active = 1 AND collectible_id = ? AND side = 'SELL'"
    )
    .all(collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getBuyActiveOrdersByCollectible(
  collectibleId: number
): Order[] {
  const orders = db
    .prepare(
      "SELECT * FROM `order` WHERE active = 1 AND collectible_id = ? AND side = 'BUY'"
    )
    .all(collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getSellActiveOrdersByCollectibleAndType(
  collectibleId: number,
  type: OrderType
): Order[] {
  const orders = db
    .prepare(
      "SELECT * FROM `order` WHERE active = 1 AND type = ? AND collectible_id = ? AND side = 'SELL'"
    )
    .all(type, collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getBuyActiveOrdersByCollectibleAndType(
  collectibleId: number,
  type: OrderType
): Order[] {
  const orders = db
    .prepare(
      "SELECT * FROM `order` WHERE active = 1 AND type = ? AND collectible_id = ? AND side = 'BUY'"
    )
    .all(type, collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getOrdersExecuted(collectibleId: number): Order[] {
  const orders = db
    .prepare('SELECT * FROM `order` WHERE executed = 1 AND collectible_id = ?')
    .all(collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getOrdersExecutedInDay(
  collectibleId: number,
  day: Date
): Order[] {
  const startOfDay = moment(day).startOf('day').clone().toISOString()
  const endOfDay = moment(day).endOf('day').clone().toISOString()

  const orders = db
    .prepare(
      `SELECT * FROM 'order' 
		 WHERE executed = 1 
		 AND collectible_id = ? 
		 AND execution_timestamp >= ? 
		 AND execution_timestamp <= ?
		 ORDER by execution_timestamp`
    )
    .all(collectibleId, startOfDay, endOfDay)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getOrdersOfUserCreatedAtDay(
  userId: string,
  collectibleId: number,
  date: Date
): Order[] {
  const startOfDay = moment(date).startOf('day').clone().toISOString()
  const endOfDay = moment(date).endOf('day').clone().toISOString()

  const orders = db
    .prepare(
      `SELECT * FROM 'order'
		 WHERE user_id = ?
		 AND collectible_id = ?
		 AND creation_timestamp >= ?
		 AND creation_timestamp <= ?
		 ORDER by creation_timestamp`
    )
    .all(userId, collectibleId, startOfDay, endOfDay)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getOrdersOfUser(
  userId: string,
  collectibleId: number
): Order[] {
  const orders = db
    .prepare('SELECT * FROM `order` WHERE user_id = ? AND collectible_id = ?')
    .all(userId, collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getActiveOrdersOfUser(
  userId: string,
  collectibleId: number
): Order[] {
  const orders = db
    .prepare(
      'SELECT * FROM `order` WHERE active = 1 AND user_id = ? AND collectible_id = ?'
    )
    .all(userId, collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getLimitOrdersExecuted(collectibleId: number): Order[] {
  const orders = db
    .prepare('SELECT * FROM `order` WHERE type = `LIMIT` AND executed = 1')
    .all(collectibleId)

  for (const order of orders) {
    if (order) {
      order.active = Boolean(order.active)
      order.executed = Boolean(order.executed)
    }
  }

  return orders
}

export function getLastOrderExecuted(collectibleId: number): Order {
  const order = db
    .prepare(
      'SELECT * FROM `order` WHERE executed = 1 AND collectible_id = ? ORDER BY execution_timestamp DESC LIMIT 1'
    )
    .get(collectibleId)

  if (order) {
    order.active = Boolean(order.active)
    order.executed = Boolean(order.executed)
  }

  return order
}

export function getCollectibleOwnershipsNotSelling(
  userId: string
): UserCollectible[] {
  const userCollectibles = db
    .prepare(`SELECT * FROM user_collectible WHERE user_id = ? AND selling = 0`)
    .all(userId)

  for (let userCollectible of userCollectibles) {
    if (userCollectible)
      userCollectible.selling = Boolean(userCollectible.selling)
  }

  return userCollectibles
}

export function getCollectibleOwnershipsSelling(
  userId: string
): UserCollectible[] {
  const userCollectibles = db
    .prepare(`SELECT * FROM user_collectible WHERE user_id = ? AND selling = 1`)
    .all(userId)

  for (const userCollectible of userCollectibles) {
    if (userCollectible)
      userCollectible.selling = Boolean(userCollectible.selling)
  }

  return userCollectibles
}

export function getSpecificCollectibleOwnershipsNotSelling(
  userId: string,
  collectibleId: number
): UserCollectible[] {
  const userCollectibles = db
    .prepare(
      `SELECT * FROM user_collectible WHERE user_id = ? AND collectible_id = ? AND selling = 0`
    )
    .all(userId, collectibleId)

  for (const userCollectible of userCollectibles) {
    if (userCollectible)
      userCollectible.selling = Boolean(userCollectible.selling)
  }

  return userCollectibles
}

export function getSpecificCollectibleOwnershipsSelling(
  userId: string,
  collectibleId: number
): UserCollectible[] {
  const userCollectibles = db
    .prepare(
      `SELECT * FROM user_collectible WHERE user_id = ? AND collectible_id = ? AND selling = 1`
    )
    .all(userId, collectibleId)

  for (const userCollectible of userCollectibles) {
    if (userCollectible)
      userCollectible.selling = Boolean(userCollectible.selling)
  }

  return userCollectibles
}

export function updateCollectibleOwnershipToSelling(userCollectibleId: number) {
  db.prepare(`UPDATE user_collectible SET selling = 1 WHERE id = ?`).run(
    userCollectibleId
  )
}

export function updateCollectibleOwnershipsToSelling(
  ...userCollectibleIds: number[]
) {
  const placeholder = userCollectibleIds.map(() => '?').join(', ')

  db.prepare(
    `UPDATE user_collectible SET selling = 1 WHERE id IN (${placeholder})`
  ).run(...userCollectibleIds)
}

export function updateCollectibleOwnershipToNotSelling(
  userCollectibleId: number
) {
  db.prepare(`UPDATE user_collectible SET selling = 0 WHERE id = ?`).run(
    userCollectibleId
  )
}

export function updateCollectibleOwnershipsToNotSelling(
  ...userCollectibleIds: number[]
) {
  const placeholder = userCollectibleIds.map(() => '?').join(', ')

  db.prepare(
    `UPDATE user_collectible SET selling = 0 WHERE id IN (${placeholder})`
  ).run(...userCollectibleIds)
}

export function getMarketPriceHistory(
  collectibleId: number,
  day: Date
): MarketPriceHistory {
  const startOfDay = moment.tz(config.timezone).startOf('day').toISOString()
  const endOfDay = moment.tz(config.timezone).endOf('day').toISOString()

  return db
    .prepare(
      'SELECT * FROM market_price_history WHERE collectible_id = ? AND timestamp BETWEEN ? AND ?'
    )
    .get(collectibleId, startOfDay, endOfDay)
}

export function addMarketPriceHistory(
  collectibleId: number,
  day: Date,
  prices: {
    highPrice: number | null
    lowPrice: number | null
    openPrice: number | null
    closePrice: number | null
  }
) {
  const existing = getMarketPriceHistory(collectibleId, day)

  if (!existing) {
    db.prepare(
      `INSERT INTO market_price_history 
			 (collectible_id, timestamp, high_price, low_price, open_price, close_price) 
			 VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      collectibleId,
      day.toISOString(),
      prices.highPrice,
      prices.lowPrice,
      prices.openPrice,
      prices.closePrice
    )
  } else {
    db.prepare(
      `UPDATE market_price_history SET 
			 high_price = ?, 
			 low_price = ?, 
			 open_price = ?, 
			 close_price = ? 
			 WHERE collectible_id = ? AND timestamp = ?`
    ).run(
      prices.highPrice,
      prices.lowPrice,
      prices.openPrice,
      prices.closePrice,
      collectibleId,
      day.toISOString()
    )
  }
}

export function getUserById(userId: string): RawUser {
  const user = db.prepare(`SELECT * FROM user WHERE id = ?`).get(userId)

  if (user) {
    user.frozen = Boolean(user.frozen)
    user.admin = Boolean(user.admin)
  }

  return user
}

export function setUserId(userId: string, newUserId: string) {
  db.prepare(`UPDATE user SET id = ? WHERE id = ?`).run(newUserId, userId)
}

export function isUsernameAvailable(username: string): boolean {
  const user = db
    .prepare(`SELECT * FROM user WHERE username = ?`)
    .get(username)

  return !user
}