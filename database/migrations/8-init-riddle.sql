
CREATE TABLE IF NOT EXISTS riddle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS riddle_part (
    id TEXT PRIMARY KEY,
    riddle_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    content TEXT NOT NULL,

    FOREIGN KEY (riddle_id) REFERENCES riddle(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS hint (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    riddle_part_id INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (riddle_part_id) REFERENCES riddle_part(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO riddle
    (title, description)
VALUES
    ('Origin', 'The riddle to get the Origin lore');

INSERT INTO riddle_part
    (id, riddle_id, position, content)
VALUES
    ('e00174b16c094c94eef5d66b5f65b542f03802d4f49b78ccdc91989191501950', 1, 1, '/lore'),
    ('bce02428fca760ba6f6106918ac929a21561a5c60fdb902755013d1e6ecff8d9', 1, 2, '/origin');