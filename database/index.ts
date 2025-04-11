const db = require('better-sqlite3')('./storage/db.sqlite3')
import crypto from 'crypto'
import argon2 from 'argon2'
import moment from 'moment-timezone'
import fs from 'fs'
import path from 'path'
import { Migration } from '../types/Migration'
import { config } from '../config/loader'
import UsernameValidator from '../validators/username'
//@ts-ignore
import usernameGenerator from "username-gen"
import { UserCollectible } from '../types/UserCollectible'
import { Collectible } from '../types/Collectible'
import log from 'loglevel'

const timezone = config.timezone || 'UTC'

export function initDatabase() {
	const migrationFiles = fs
		.readdirSync(path.join(__dirname, './migrations'))
		.sort((a, b) => parseInt(a.split('-')[0], 10) - parseInt(b.split('-')[0], 10))

	let executedMigrations: Migration[] = []

	try {
		executedMigrations = [...db.prepare(`SELECT * FROM _migration`).all()]
	} catch (e) {}

	if (executedMigrations.length === 0) {
		log.info(
			`[DATABASE] Database is uninitialized, all migrations will be run`,
		)
	}

	for (const file of migrationFiles) {
		if (!executedMigrations.find((m) => m.filename === file)) {
			log.info(`[DATABASE] Running migration ${file}`)
			const migration = fs.readFileSync(
				path.join(__dirname, `./migrations/${file}`),
				'utf-8',
			)
			db.exec(migration)
			db.prepare(
				`INSERT INTO _migration(filename, timestamp) VALUES(?, ?)`,
			).run(file, new Date().toISOString())
		}
	}
}

export function getPoop(poopId: number) {
	return db.prepare(`SELECT * FROM poop WHERE id = ?`).get(poopId)
}

export function deletePoop(poopId: number) {

	const poop = db.prepare(`SELECT * FROM poop WHERE id = ?`).get(poopId)

	db.prepare(`DELETE FROM poop WHERE id = ?`).run(poopId)

	db.prepare(
		`UPDATE user SET money = (SELECT money FROM user WHERE id = ?) - 1 WHERE id = ?`,
	).run(poop.user_id, poop.user_id)
}

export function getCollectible(collectibleId: number) {
	return db.prepare(`SELECT * FROM collectible WHERE id = ?`).get(collectibleId)
}

export function getCollectibleOwnerships(userId: string): UserCollectible[] {
	return db.prepare(`SELECT * FROM user_collectible WHERE user_id = ?`).all(userId)
}

export function getCollectibleOwnershipById(userCollectibleId: number): UserCollectible {
	return db.prepare(`SELECT * FROM user_collectible WHERE id = ?`).get(userCollectibleId)
}

export function deleteUserCollectible(userCollectibleId: number) {
	db.prepare(
		`DELETE FROM user_collectible WHERE id = ?`,
	).run(userCollectibleId)
}

export function isUserAdmin(userId: string) {
	return db.prepare(`SELECT admin FROM user WHERE id = ?`).get(userId).admin
}

export function setUserAdmin(userId: string, admin: boolean) {
	db.prepare(`UPDATE user SET admin = ? WHERE id = ?`).run(admin, userId)
}

export function getAllUsers() {
	return db.prepare(`SELECT id, username, pfp, openedPacks, money, frozen FROM user`).all()
}

export function getPoops(limit: number, offset: number) {
	return db
		.prepare(
		`
		SELECT *
		FROM poop
		ORDER BY timestamp DESC
		LIMIT ? OFFSET ?
		`,
		)
		.all(limit, offset)
}

export function getAchievement(achievementId: string) {
	return db.prepare(`SELECT * FROM achievement WHERE id = ?`).get(achievementId)
}

export function getInactiveUsers(date: Date) {
	const startOfMonth = moment(date)
		.startOf('month')
		.utc()
		.toISOString()
	const endOfMonth = moment(date)
		.endOf('month')
		.utc()
		.toISOString()

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
    `,
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
			`,
		)
		.all()
		.reduce(
			(
				acc: Record<string, number>,
				{ date, poops }: Record<string, number>,
			) => {
				acc[date] = poops
				return acc
			},
			{},
		)
}

export function getUserCount() {
	return db.prepare(`SELECT COUNT(*) as totalUsers FROM user`).get().totalUsers
}

export function getMonthlyUserCount(date: string) {
	const startOfMonth = moment(date)
		.startOf('month')
		.utc()
		.toISOString()
	const endOfMonth = moment(date)
		.endOf('month')
		.utc()
		.toISOString()

	return db
		.prepare(
			`
			SELECT COUNT(DISTINCT u.id) as monthlyUsers
			FROM user u
			JOIN poop p ON u.id = p.user_id
			WHERE p.timestamp BETWEEN ? AND ?
		`,
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
            ) uc ON u.id = uc.user_id`,
		)
		.get().circulatingMoneyWithAssets
}

export function getDailyPoopCount(date: string) {
	const startOfDay = moment(date)
		.startOf('day')
		.clone()
		.toISOString()
	const endOfDay = moment(date)
		.endOf('day')
		.clone()
		.toISOString()

	const currentCount = db
		.prepare(
			`
            SELECT COUNT(*) AS dailyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `,
		)
		.get(startOfDay, endOfDay).dailyPoops

	const previousStartOfDayUTC = moment(startOfDay)
		.subtract(1, 'day')
		.toISOString()
	const previousEndOfDayUTC = moment(endOfDay)
		.subtract(1, 'day')
		.toISOString()

	const previousCount = db
		.prepare(
			`
            SELECT COUNT(*) AS previousDailyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `,
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
        `,
		)
		.get(startOfCurrentWeekUTC, endOfCurrentWeekUTC).weeklyPoops

	const previousCount = db
		.prepare(
			`
            SELECT COUNT(*) AS previousWeeklyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `,
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
        `,
		)
		.get(startOfCurrentMonth, endOfCurrentMonth).monthlyPoops

	const previousCount = db
		.prepare(
			`
            SELECT COUNT(*) AS previousMonthlyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `,
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
	`,
		)
		.get()
}

export function getDailyTopPooper(date: string) {
	const startOfDay = moment(date)
		.startOf('day')
		.utc()
		.toISOString()
	const endOfDay = moment(date)
		.endOf('day')
		.utc()
		.toISOString()

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
    `,
		)
		.get(startOfDay, endOfDay)
}

export function getWeeklyTopPooper(date: string) {
	const startOfWeek = moment(date)
		.isoWeekday(1)
		.startOf('day')
		.utc()
		.toISOString()
	const endOfWeek = moment(date)
		.isoWeekday(7)
		.endOf('day')
		.utc()
		.toISOString()

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
    `,
		)
		.get(startOfWeek, endOfWeek)
}

export function getMonthlyTopPooper(date: string) {
	const startOfMonth = moment(date)
		.startOf('month')
		.utc()
		.toISOString()
	const endOfMonth = moment(date)
		.endOf('month')
		.utc()
		.toISOString()

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
    `,
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
    `,
		)
		.get()
}

export function getMonthlyPoopDistribution(date: string) {
	const startOfMonth = moment(date)
		.startOf('month')
		.utc()
		.toISOString()
	const endOfMonth = moment(date)
		.endOf('month')
		.utc()
		.toISOString()

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
        `,
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

export async function login(username: string, password: string) {
	const user = db.prepare(`SELECT * FROM user WHERE username = ?`).get(username)

	if (!user) {
		return null
	}

	if (!(await argon2.verify(user.password, password))) {
		return null
	}

	return user
}

export function getUserByToken(token: string) {
	const user = db.prepare(`SELECT * FROM user WHERE token = ?`).get(token)
	if (user) {
		user.frozen = Boolean(user.frozen)
		user.admin = Boolean(user.admin)
	}

	return user
}

export function generateToken(userId: string) {
	const token = crypto.randomBytes(64).toString('hex')
	db.prepare(`UPDATE user SET token = ? WHERE id = ?`).run(token, userId)
	return token
}

export async function updatePassword(userId: string, password: string) {
	const hash = await argon2.hash(password)
	db.prepare(`UPDATE user SET password = ? WHERE id = ?`).run(hash, userId)
	generateToken(userId)
}

export function createUser(
	rawPhone: string,
	username: string,
	bio: string | null,
) {
	const phone = sanitizePhone(rawPhone)
	const id = hashId(phone)

	while (!UsernameValidator.validate(username) || !isUsernameAvailable(username)) {
		username = usernameGenerator.generateUsername(8, false)
	}

	db.prepare(
		`INSERT INTO user (id, phone, username, bio) VALUES (?, ?, ?, ?)`,
	).run(id, phone, username, bio)
}

export function isUsernameAvailable(username: string): boolean {
	return getUserProfileByUsername(username).id == null
}

export function getUserCollectibles(userId: string) {
	return db
		.prepare(
		`
			SELECT c.id, c.name, c.description, c.asset_url, c.rarity_id, COUNT(uc.collectible_id) AS quantity
			FROM collectible c
			JOIN user_collectible uc ON uc.collectible_id = c.id
			JOIN user u ON uc.user_id = u.id
			WHERE u.id = ?
			GROUP BY c.id, c.rarity_id
			ORDER BY c.rarity_id DESC
    	`,
		)
		.all(userId)
}

export function setMoney(userId: string, amount: number) {
	db.prepare(`UPDATE user SET money = ? WHERE id = ?`).run(amount, userId)
}

export function addCollectibleToUser(userId: string, collectibleId: number) {
	db.prepare(
		`INSERT INTO user_collectible(user_id, collectible_id) VALUES(?, ?)`,
	).run(userId, collectibleId)
}

export function addOpenedPack(userId: string) {
	db.prepare(
		`UPDATE user SET openedPacks = (SELECT openedPacks FROM user WHERE id = ?) + 1 WHERE id = ?`,
	).run(userId, userId)
}

export function getRarities() {
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
			'SELECT u.*, COUNT(p.id) as poops FROM user u JOIN poop p ON u.id = p.user_id WHERE u.id = ?',
		)
		.get(userId)
}

export function getUserProfileByUsername(username: string) {
	return db
		.prepare(
			'SELECT u.*, COUNT(p.id) as poops FROM user u LEFT JOIN poop p ON u.id = p.user_id WHERE u.username = ?',
		)
		.get(username)
}

export function getUserProfileByPhone(phone: string) {
	phone = sanitizePhone(phone)
	return db
		.prepare(
			'SELECT u.*, COUNT(p.id) as poops FROM user u LEFT JOIN poop p ON u.id = p.user_id WHERE u.phone = ?',
		)
		.get(phone)
}

export function getLastPoop() {
	return db.prepare(`SELECT * FROM poop ORDER BY id DESC LIMIT 1`).get()
}

export function addPoop(userId: string) {
	// this is voluntarily stored in UTC for best practice
	db.prepare(`INSERT INTO poop (user_id, timestamp) VALUES (?, ?)`).run(
		userId,
		new Date().toISOString(),
	)

	db.prepare(
		`UPDATE user SET money = (SELECT money FROM user WHERE id = ?) + 1 WHERE id = ?`,
	).run(userId, userId)
}

export function addPoopWithTimestamp(userId: string, timestamp: string) {
	db.prepare(`INSERT INTO poop (user_id, timestamp) VALUES (?, ?)`).run(
		userId,
		timestamp,
	)

	db.prepare(
		`UPDATE user SET money = (SELECT money FROM user WHERE id = ?) + 1 WHERE id = ?`,
	).run(userId, userId)
}

export function poopLeaderboard() {
	const result = db
		.prepare(
			`
            SELECT u.id, u.phone, u.username, u.pfp, u.bio, u.frozen, u.money, u.admin,
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
        `,
		)
		.all()

	return result.map((row: any) => ({
		...row,
		frozen: Boolean(row.frozen),
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
        SELECT u.id, u.phone, u.username, u.pfp, u.bio, u.frozen, u.money, 
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
    `,
		)
		.all(startOfMonth, endOfMonth)

	return result.map((row: any) => ({
		...row,
		frozen: Boolean(row.frozen),
	}))
}

export function allPoop() {
	return db
		.prepare(
			'SELECT p.*, u.username as username FROM poop p JOIN user u ON p.user_id = u.id',
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
         WHERE p.timestamp BETWEEN ? AND ?`,
		)
		.all(startOfMonth, endOfMonth)
}

export function getPoopsFromUser(userId: string) {
	return db
		.prepare(
			'SELECT p.* FROM poop p JOIN user u ON p.user_id = u.id WHERE u.id = ?',
		)
		.all(userId)
}

export function getPoopsFromUserWithFilter(
	userId: string,
	year: number,
	month: number,
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
         WHERE u.id = ? AND p.timestamp >= ? AND p.timestamp <= ?`,
		)
		.all(userId, startOfMonthIso, endOfMonthIso)
}

export function poopStatsFromUser(userId: string) {
	const startOfDay = moment
		.tz(
			{
				year: moment().year(),
				month: moment().month(),
				day: moment().date(),
			},
			timezone,
		)
		.startOf('day')
		.utc()
		.toISOString()

	const endOfDay = moment
		.tz(
			{
				year: moment().year(),
				month: moment().month(),
				day: moment().date(),
			},
			timezone,
		)
		.endOf('day')
		.utc()
		.toISOString()

	const startOfWeek = moment
		.tz(
			{
				year: moment().year(),
				month: moment().month(),
				day: moment().date(),
			},
			timezone,
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
				day: moment().date(),
			},
			timezone,
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
				month: moment().month(),
			},
			timezone,
		)
		.startOf('month')
		.utc()
		.toISOString()

	const endOfMonth = moment
		.tz(
			{
				year: moment().year(),
				month: moment().month(),
			},
			timezone,
		)
		.endOf('month')
		.utc()
		.toISOString()

	const todayPoops = db
		.prepare(
			`SELECT COUNT(*) as today FROM poop WHERE timestamp BETWEEN ? AND ? AND poop.user_id = ?`,
		)
		.get(startOfDay, endOfDay, userId)

	const weeklyPoops = db
		.prepare(
			`SELECT COUNT(*) as week FROM poop WHERE timestamp BETWEEN ? AND ? AND poop.user_id = ?`,
		)
		.get(startOfWeek, endOfWeek, userId)

	const monthlyPoops = db
		.prepare(
			`SELECT COUNT(*) as month FROM poop WHERE timestamp BETWEEN ? AND ? AND poop.user_id = ?`,
		)
		.get(startOfMonth, endOfMonth, userId)

	const totalPoops = db
		.prepare(`SELECT COUNT(*) as total FROM poop WHERE poop.user_id = ?`)
		.get(userId)

	return {
		today: todayPoops.today,
		week: weeklyPoops.week,
		month: monthlyPoops.month,
		total: totalPoops.total,
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
		`,
		)
		.all(userId)
		.map((x: any) => x.days)

	days.push(
		`${new Date().getFullYear()}-${(new Date().getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
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
	month: number,
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
				day: moment().date(),
			},
			timezone,
		)
		.startOf('day')
		.utc()
		.toISOString()

	const endOfDay = moment
		.tz(
			{
				year: moment().year(),
				month: moment().month(),
				day: moment().date(),
			},
			timezone,
		)
		.endOf('day')
		.utc()
		.toISOString()

	const startOfWeek = moment
		.tz(
			{
				year: moment().year(),
				month: moment().month(),
				day: moment().date(),
			},
			timezone,
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
				day: moment().date(),
			},
			timezone,
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
				month: moment().month(),
			},
			timezone,
		)
		.startOf('month')
		.utc()
		.toISOString()

	const endOfMonth = moment
		.tz(
			{
				year: moment().year(),
				month: moment().month(),
			},
			timezone,
		)
		.endOf('month')
		.utc()
		.toISOString()

	const todayPoops = db
		.prepare(
			`SELECT COUNT(*) as today FROM poop WHERE timestamp BETWEEN ? AND ?`,
		)
		.get(startOfDay, endOfDay)

	const weeklyPoops = db
		.prepare(
			`SELECT COUNT(*) as week FROM poop WHERE timestamp BETWEEN ? AND ?`,
		)
		.get(startOfWeek, endOfWeek)

	const monthlyPoops = db
		.prepare(
			`SELECT COUNT(*) as month FROM poop WHERE timestamp BETWEEN ? AND ?`,
		)
		.get(startOfMonth, endOfMonth)

	const totalPoops = db.prepare(`SELECT COUNT(*) as total FROM poop`).get()

	return {
		day: todayPoops.today,
		week: weeklyPoops.week,
		month: monthlyPoops.month,
		total: totalPoops.total,
	}
}

export function updateProfilePicture(userId: string, imageUrl: string | null) {
	db.prepare(
		`
        UPDATE user
        SET pfp = ?
        WHERE id = ?
    `,
	).run(imageUrl, userId)
}

export function updateBio(userId: string, bio: string) {
	db.prepare(
		`
		UPDATE user
		SET bio = ?
		WHERE id = ?
	`,
	).run(bio, userId)
}

export function sanitizePhone(phone: string) {
	return phone.match(/^\d+/)![0]
}

export function hashId(id: string) {
	return crypto.createHash('md5').update(id.match(/^\d+/)![0]).digest('hex')
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
		`INSERT INTO user_achievement (user_id, achievement_id, timestamp) VALUES (?, ?, ?)`,
	).run(userId, achievementId, new Date().toISOString())

	db.prepare(
		`UPDATE user SET money = (SELECT money FROM user WHERE id = ?) + (SELECT d.reward FROM achievement a JOIN difficulty d ON a.difficulty_id = d.id WHERE a.id = ?) WHERE id = ?`,
	).run(userId, achievementId, userId)
}

export function checkAchievementForUser(userId: string, achievementId: string) {
	return (
		db
			.prepare(
				`SELECT a.id FROM achievement a JOIN user_achievement ua ON a.id = ua.achievement_id 
		JOIN user u ON u.id = ua.user_id WHERE u.id = ? AND a.id = ?`,
			)
			.get(userId, achievementId)?.id != null
	)
}

export function getUserAchievements(userId: string) {
	return db
		.prepare(
			'SELECT a.* FROM user_achievement a JOIN user u ON a.user_id = u.id WHERE u.id = ? ORDER BY a.timestamp DESC',
		)
		.all(userId)
}

export function getAllAchievements() {
	return db.prepare('SELECT a.* FROM achievement a').all()
}
