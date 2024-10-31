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

CREATE TABLE IF NOT EXISTS _migration (
	filename TEXT,
	timestamp TIMESTAMP
);