

ALTER TABLE user_collectible ADD selling INTEGER DEFAULT 0 NOT NULL;


CREATE TABLE IF NOT EXISTS order_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS order_side (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "order" (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT,
	collectible_id INTEGER,
	type TEXT NOT NULL,
	side TEXT NOT NULL,
	price INTEGER,
	active INTEGER DEFAULT 1,
	creation_timestamp TIMESTAMP,
	executed INTEGER DEFAULT 0,
	execution_timestamp TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (collectible_id) REFERENCES collectible(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (type) REFERENCES order_type(value),
	FOREIGN KEY (side) REFERENCES order_side(value)
);

INSERT
	OR IGNORE INTO order_side(value)
VALUES
	('SELL');
INSERT
	OR IGNORE INTO order_side(value)
VALUES
	('BUY');

INSERT
	OR IGNORE INTO order_type(value)
VALUES
	('MARKET');
INSERT
	OR IGNORE INTO order_type(value)
VALUES
	('LIMIT');