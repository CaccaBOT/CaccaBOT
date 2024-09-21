const db = require('better-sqlite3')('./storage/db.sqlite3')
import crypto from 'crypto'
import argon2 from 'argon2'
import moment from 'moment-timezone'
import config from '../config.json'

const timezone = config.timezone || 'UTC'

export function initDatabase() {
	db.exec(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS user (
            id TEXT PRIMARY KEY,
            phone TEXT,
            username TEXT,
			password TEXT,
			frozen INTEGER DEFAULT 0,
			token TEXT,
            pfp TEXT,
            bio TEXT,
			money INTEGER DEFAULT 0,
			openedPacks INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS poop (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

		CREATE TABLE IF NOT EXISTS rarity (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE,
			chance INTEGER
		);

		CREATE TABLE IF NOT EXISTS collectible (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE,
			description TEXT,
			rarity_id INTEGER,
			asset_url TEXT,
			FOREIGN KEY (rarity_id) REFERENCES rarity(id)
		);

		CREATE TABLE IF NOT EXISTS user_collectible (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            collectible_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (collectible_id) REFERENCES collectible(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

		CREATE TABLE IF NOT EXISTS difficulty (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE,
			reward INTEGER
		);

		CREATE TABLE IF NOT EXISTS achievement (
			id TEXT UNIQUE,
			name TEXT UNIQUE,
			description TEXT,
			difficulty_id INTEGER,
			FOREIGN KEY (difficulty_id) REFERENCES difficulty(id)
		);

		CREATE TABLE IF NOT EXISTS user_achievement (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            achievement_id TEXT,
			timestamp TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (achievement_id) REFERENCES achievement(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

		INSERT OR IGNORE INTO rarity(name, chance) VALUES ('Merdume', 59);
		INSERT OR IGNORE INTO rarity(name, chance) VALUES ('Escrementale', 30); 
		INSERT OR IGNORE INTO rarity(name, chance) VALUES ('Sensazianale', 10); 
		INSERT OR IGNORE INTO rarity(name, chance) VALUES ('Caccasmagorico', 1); 

		INSERT OR IGNORE INTO difficulty(name, reward) VALUES ('Easy', 1);
		INSERT OR IGNORE INTO difficulty(name, reward) VALUES ('Medium', 5); 
		INSERT OR IGNORE INTO difficulty(name, reward) VALUES ('Hard', 15); 
		INSERT OR IGNORE INTO difficulty(name, reward) VALUES ('Extreme', 100); 

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('VulcANO', 'Cacca con parte superiore a forma di vulcano che erutta magma', 
				(SELECT id FROM rarity WHERE name = 'Merdume'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Jeff Merdos', 'Cacca dorata con i baffi da nobile, un bastone e un monocolo', 
				(SELECT id FROM rarity WHERE name = 'Caccasmagorico'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Scopino', NULL, 
				(SELECT id FROM rarity WHERE name = 'Merdume'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Cesso', NULL, 
				(SELECT id FROM rarity WHERE name = 'Merdume'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Carta Igienica', NULL, 
				(SELECT id FROM rarity WHERE name = 'Merdume'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Cacapops', 'Cacca a forma di palline come quella dei conigli o dei cereali cocopops', 
				(SELECT id FROM rarity WHERE name = 'Escrementale'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Una giornata di merda', 'Merdachan al cesso', 
				(SELECT id FROM rarity WHERE name = 'Caccasmagorico'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Supercacca', 'Cacca con mantello da supereroe e una grande "C" sul petto', 
				(SELECT id FROM rarity WHERE name = 'Sensazianale'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Merdinfiore', 'Cacca da cui sboccia un fiore', 
				(SELECT id FROM rarity WHERE name = 'Merdume'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Merdangelo', 'Cacca con ali e aureola', 
				(SELECT id FROM rarity WHERE name = 'Sensazianale'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Robomerda', 'Cacca con sembianze robotiche', 
				(SELECT id FROM rarity WHERE name = 'Sensazianale'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Cesso di Jeff Merdos', 'Cesso dorato (di Jeff Merdos)', 
				(SELECT id FROM rarity WHERE name = 'Caccasmagorico'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Cacca Samurai', 'Cacca con sembianze di un samurai (armatura, elmetto, spada)', 
				(SELECT id FROM rarity WHERE name = 'Merdume'), NULL);

		INSERT OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
		VALUES ('Caccantante', NULL, 
				(SELECT id FROM rarity WHERE name = 'Merdume'), NULL);

		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('CACCASTOMIZER', 'Caccastomizer', 'Modifica il profilo',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('I_BECAME_RICH', 'Sono diventato ricco', 'Guadagna il tuo primo merdollaro',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('THE_FIRST_OF_A_LONG_TIME', 'La prima di una lunga storia', 'Apri il tuo primo cacchetto',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('POOPATIC', 'Caccapatico', 'Apri il tuo 50esimo cacchetto',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('DEMONIC_POOP', 'Cacca indemoniata', 'Accumula esattamente 666 merdollari',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('INSTANT_EFFECT', 'Presa Diretta', 'Caga dopo pranzo (12:00 - 14:00)',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('TIME_FOR_A_SNACK', 'È Tempo Della Merdenda', 'Caga dopo la merenda (16:00 - 18:00)',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('POOP_ON_WHEELCHAIR', 'Cacca A Rotelle', 'Caga alle 01:04 (sei disabile)',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('SKIBIDI_TOILET', 'Skibidi Toilet', 'Caga alle 03:00 di notte (per evocare Skibidi Toilet)',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('SMOKE_POOP_EVERYDAY', 'Smoke Poop Everyday', 'Caga alle 04:20 (passacene un po)',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('LAST_MINUTE', 'Last Minute', 'Caga all''ultimo minuto prima del reset',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('FAST_AND_FECIOUS', 'Fast & Fecious', 'Sii il primo a cagare dopo il reset',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('GOD_IS_SHIT', 'Dio Merda', 'Caga il giorno di Pasqua',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('SHITTY_FAGGOT', 'Frocio di merda', 'Caga durante il Pride Month',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('PATRIOTIC_POOP', 'Merda patriottica', 'Caga durante il giorno della Repubblica',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('I_SAID_THEY_ARE_SHITS', 'L''ho detto che sono delle merde!', 'Colleziona una caccarta Merdume',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('ESCREMENTAL_WATSON', 'Escrementale, Watson', 'Colleziona una carta Escrementale',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('NOT_EVERYTHING_THAT_SHINES_IS_GOLD', 'Tutto ciò che splende non è oro', 'Colleziona una caccarta Sensazianale',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('WHAT_AN_ASSHOLE', 'Che buco di culo', 'Colleziona una caccarta Caccasmagorica',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('POOP_SOMMELIER', 'Il sommelier della merda', 'Colleziona la metà delle caccarte',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('POOPDEX_COMPLETED', 'Caccadex Completato', 'Colleziona tutte le caccarte',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('PENTAKILL', 'Pentakill', 'Caga 5 volte nello stesso giorno',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('SCAT_LOVER', 'Scat Lover', 'Accumula 69 cagate di fila',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('ONE_MONTH_OF_SHIT', 'Un mese di merda', 'Accumula 30 cagate di fila',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
		
		INSERT OR IGNORE INTO achievement (id, name, description, difficulty_id)
		VALUES ('A_YEAR_OF_SHIT', 'Un anno di merda', 'Accumula 365 cagate di fila',
				(SELECT id FROM difficulty WHERE name = 'Easy'));
    `)
}

export function getAchievement(achievementId: string) {
	return db.prepare(`SELECT * FROM achievement WHERE id = ?`).get(achievementId)
}

export function getInactiveUsers(date: Date) {
	const startOfMonth = moment(date)
		.tz(timezone)
		.startOf('month')
		.utc()
		.toISOString()
	const endOfMonth = moment(date)
		.tz(timezone)
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
			`,
		)
		.all()
		.reduce((acc: Record<string, number>, { date, poops }: Record<string, number>) => {
			acc[date] = poops
			return acc
		}, {})
}

export function getUserCount() {
	return db.prepare(`SELECT COUNT(*) as totalUsers FROM user`).get().totalUsers
}

export function getMonthlyUserCount(date: string) {
	const startOfMonth = moment(date)
	.tz(timezone)
	.startOf('month')
	.utc()
	.toISOString()
	const endOfMonth = moment(date)
	.tz(timezone)
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
	const startOfDayUTC = moment
		.tz(date, timezone)
		.startOf('day')
		.clone()
		.toISOString()
	const endOfDayUTC = moment
		.tz(date, timezone)
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
		.get(startOfDayUTC, endOfDayUTC).dailyPoops

	const previousStartOfDayUTC = moment(startOfDayUTC)
		.subtract(1, 'day')
		.toISOString()
	const previousEndOfDayUTC = moment(endOfDayUTC)
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
	const startOfCurrentWeekUTC = moment
		.tz(date, timezone)
		.startOf('week')
		.clone()
		.utc()
		.toISOString()
	const endOfCurrentWeekUTC = moment
		.tz(date, timezone)
		.endOf('week')
		.clone()
		.utc()
		.toISOString()
	const startOfPreviousWeekUTC = moment
		.tz(date, timezone)
		.subtract(1, 'week')
		.startOf('week')
		.clone()
		.utc()
		.toISOString()
	const endOfPreviousWeekUTC = moment
		.tz(date, timezone)
		.subtract(1, 'week')
		.endOf('week')
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
	const startOfCurrentMonthUTC = moment
		.tz(date, timezone)
		.startOf('month')
		.clone()
		.utc()
		.toISOString()
	const endOfCurrentMonthUTC = moment
		.tz(date, timezone)
		.endOf('month')
		.clone()
		.utc()
		.toISOString()
	const startOfPreviousMonthUTC = moment
		.tz(date, timezone)
		.subtract(1, 'month')
		.startOf('month')
		.clone()
		.utc()
		.toISOString()
	const endOfPreviousMonthUTC = moment
		.tz(date, timezone)
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
		.get(startOfCurrentMonthUTC, endOfCurrentMonthUTC).monthlyPoops

	const previousCount = db
		.prepare(
			`
            SELECT COUNT(*) AS previousMonthlyPoops
            FROM poop
            WHERE timestamp >= ? AND timestamp < ?
        `,
		)
		.get(startOfPreviousMonthUTC, endOfPreviousMonthUTC).previousMonthlyPoops

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
	const formattedDate = moment(date).tz(timezone).format('YYYY-MM-DD')
	return db
		.prepare(
			`
        SELECT u.id, u.username, u.pfp, COUNT(p.id) as poops
        FROM user u
        JOIN poop p ON u.id = p.user_id
        WHERE DATE(p.timestamp) = DATE(?)
        GROUP BY u.id
        ORDER BY poops DESC
        LIMIT 1
    `
		)
		.get(formattedDate)
}

export function getWeeklyTopPooper(date: string) {
	const startOfWeek = moment(date)
		.tz(timezone)
		.startOf('week')
		.format('YYYY-MM-DD')
	const endOfWeek = moment(date).tz(timezone).endOf('week').format('YYYY-MM-DD')
	return db
		.prepare(
			`
        SELECT u.id, u.username, u.pfp, COUNT(p.id) as poops
        FROM user u
        JOIN poop p ON u.id = p.user_id
        WHERE DATE(p.timestamp) BETWEEN 
            DATE(?, 'weekday 0', '-6 days') AND 
            DATE(?, 'weekday 0')
        GROUP BY u.id
        ORDER BY poops DESC
        LIMIT 1
    `
		)
		.get(startOfWeek, endOfWeek)
}

export function getMonthlyTopPooper(date: string) {
	const formattedDate = moment(date).tz(timezone).format('YYYY-MM')
	return db
		.prepare(
			`
        SELECT u.id, u.username, u.pfp, COUNT(p.id) as poops
        FROM user u
        JOIN poop p ON u.id = p.user_id
        WHERE strftime('%Y-%m', p.timestamp) = strftime('%Y-%m', ?)
        GROUP BY u.id
        ORDER BY poops DESC
        LIMIT 1
    `
		)
		.get(formattedDate)
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
	const formattedDate = moment(date).tz(timezone).format('YYYY-MM')
	return db
		.prepare(
			`
            SELECT 
                u.id,
                u.username,
                u.pfp,
                ROUND((COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM poop WHERE strftime('%Y-%m', timestamp) = ?)), 2) as percentage
            FROM user u
            JOIN poop p ON u.id = p.user_id
            WHERE strftime('%Y-%m', p.timestamp) = ?
            GROUP BY u.id, u.username
            ORDER BY percentage DESC
        `,
		)
		.all(formattedDate, formattedDate)
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

export function createUser(rawPhone: string, username: string, bio: string | null) {
	const phone = sanitizePhone(rawPhone)
	const id = hashId(phone)

	db.prepare(
		`INSERT INTO user (id, phone, username, bio) VALUES (?, ?, ?, ?)`,
	).run(id, phone, username, bio)
}

export function getUserCollectibles(userId: string) {
	return db
		.prepare(
			`
        SELECT c.name, c.description, c.asset_url, r.name as rarity, COUNT(uc.collectible_id) AS quantity
        FROM collectible c
        JOIN user_collectible uc ON uc.collectible_id = c.id
        JOIN user u ON uc.user_id = u.id
        JOIN rarity r ON c.rarity_id = r.id
        WHERE u.id = ?
        GROUP BY c.id, r.name
        ORDER BY r.id DESC
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

export function getCollectibles(rarityId: number) {
	return db.prepare(`SELECT * FROM collectible WHERE rarity_id = ?`).all(rarityId)
}

export function getAllCollectibles() {
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
			'SELECT u.*, COUNT(p.id) as poops FROM user u JOIN poop p ON u.id = p.user_id WHERE u.username = ?',
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
		new Date().toISOString()
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
            SELECT u.id, u.phone, u.username, u.pfp, u.bio, u.frozen, u.money,
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
	const yearStr = year.toString()
	const monthStr = month.toString().padStart(2, '0')

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
            WHERE strftime('%Y', p.timestamp) = ? 
                  AND strftime('%m', p.timestamp) = ?
            GROUP BY p.user_id
        ) AS poop_counts
        JOIN user u ON poop_counts.user_id = u.id
        ORDER BY poops DESC
    `
		)
		.all(yearStr, monthStr)

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
	const startOfMonth = moment({year, month})
	.tz(timezone)
	.startOf('month')
	.utc()
	.toISOString()
	const endOfMonth = moment({year, month})
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
         WHERE p.timestamp >= ? AND p.timestamp <= ?`
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

export function getPoopsFromUserWithFilter(userId: string, year: number, month: number) {
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
	const now = new Date()
	const todayStart = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
	)
	const todayEnd = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			23,
			59,
			59,
			999,
		),
	)

	const startOfWeek = new Date(todayStart)
	startOfWeek.setUTCDate(todayStart.getUTCDate() - todayStart.getUTCDay())

	const startOfMonth = new Date(todayStart)
	startOfMonth.setUTCDate(1)

	const today = todayStart.toISOString()
	const todayEndSqlite = todayEnd.toISOString()
	const weekStart = startOfWeek.toISOString()
	const monthStart = startOfMonth.toISOString()

	const todayPoops = db
		.prepare(
			`SELECT COUNT(*) as today FROM poop WHERE timestamp BETWEEN ? AND ? AND poop.user_id = ?`,
		)
		.get(today, todayEndSqlite, userId)

	const weeklyPoops = db
		.prepare(
			`SELECT COUNT(*) as week FROM poop WHERE timestamp >= ? AND poop.user_id = ?`,
		)
		.get(weekStart, userId)

	const monthlyPoops = db
		.prepare(
			`SELECT COUNT(*) as month FROM poop WHERE timestamp >= ? AND poop.user_id = ?`,
		)
		.get(monthStart, userId)

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

export function poopStatsFromUserWithFilter(userId: string, year: number, month: number) {
	const currentDate = moment().tz(timezone)
	const daysConsidered =
		year === currentDate.year() && month === currentDate.month() + 1
			? currentDate.date()
			: moment()
					.year(year)
					.month(month - 1)
					.endOf('month')
					.date()

	const monthlyLeaderboardPosition =
		poopLeaderboardWithFilter(year, month).find((x: any) => x.id === userId)?.rank ?? 0
	const streak = poopStreak(userId)
	const poops = getPoopsFromUserWithFilter(userId, year, month)
	const poopAverage = parseFloat((poops.length / daysConsidered).toFixed(2))

	return { monthlyLeaderboardPosition, streak, poopAverage }
}

export function poopStats() {
	const now = new Date()
	const todayStart = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
	)
	const todayEnd = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			23,
			59,
			59,
			999
		)
	)

	const startOfWeek = new Date(todayStart)
	startOfWeek.setUTCDate(todayStart.getUTCDate() - todayStart.getUTCDay())

	const startOfMonth = new Date(todayStart)
	startOfMonth.setUTCDate(1)

	const todayPoops = db
		.prepare(
			`SELECT COUNT(*) as today FROM poop WHERE timestamp BETWEEN ? AND ?`,
		)
		.get(todayStart, todayEnd)

	const weeklyPoops = db
		.prepare(`SELECT COUNT(*) as week FROM poop WHERE timestamp >= ?`)
		.get(startOfWeek)

	const monthlyPoops = db
		.prepare(`SELECT COUNT(*) as month FROM poop WHERE timestamp >= ?`)
		.get(startOfMonth)

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
			'SELECT a.* FROM user_achievement a JOIN user u ON a.user_id = u.id WHERE u.id = ?',
		)
		.all(userId)
}

export function getAllAchievements() {
	return db.prepare('SELECT a.* FROM achievement a').all()
}