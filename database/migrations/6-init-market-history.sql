CREATE TABLE IF NOT EXISTS market_price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collectible_id INTEGER NOT NULL,
    open_price INTEGER,
    close_price INTEGER,
    high_price INTEGER,
    low_price INTEGER,
    timestamp TIMESTAMP NOT NULL,

    FOREIGN KEY (collectible_id) REFERENCES collectible(id) ON DELETE CASCADE ON UPDATE CASCADE
);