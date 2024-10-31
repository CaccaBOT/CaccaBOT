INSERT
    OR IGNORE INTO difficulty(name, reward)
VALUES
    ('Easy', 1);

INSERT
    OR IGNORE INTO difficulty(name, reward)
VALUES
    ('Medium', 5);

INSERT
    OR IGNORE INTO difficulty(name, reward)
VALUES
    ('Hard', 15);

INSERT
    OR IGNORE INTO difficulty(name, reward)
VALUES
    ('Extreme', 100);

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'CACCASTOMIZER',
        'Caccastomizer',
        'Modifica il profilo',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'I_BECAME_RICH',
        'Sono diventato ricco',
        'Guadagna il tuo primo merdollaro',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'THE_FIRST_OF_A_LONG_TIME',
        'La prima di una lunga storia',
        'Apri il tuo primo cacchetto',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'POOPATIC',
        'Caccapatico',
        'Apri il tuo 50esimo cacchetto',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Medium'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'DEMONIC_POOP',
        'Cacca indemoniata',
        'Accumula esattamente 666 merdollari',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'INSTANT_EFFECT',
        'Presa Diretta',
        'Caga dopo pranzo (12:00 - 14:00)',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'TIME_FOR_A_SNACK',
        'È Tempo Della Merdenda',
        'Caga dopo la merenda (16:00 - 18:00)',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'POOP_ON_WHEELCHAIR',
        'Cacca A Rotelle',
        'Caga alle 01:04 (sei disabile)',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Medium'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'SKIBIDI_TOILET',
        'Skibidi Toilet',
        'Caga alle 03:00 di notte (per evocare Skibidi Toilet)',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Medium'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'SMOKE_POOP_EVERYDAY',
        'Smoke Poop Everyday',
        'Caga alle 04:20 (passacene un po)',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Medium'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'LAST_MINUTE',
        'Last Minute',
        'Caga all''ultimo minuto prima del reset',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'FAST_AND_FECIOUS',
        'Fast & Fecious',
        'Sii il primo a cagare dopo il reset',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'GOD_IS_SHIT',
        'Dio Merda',
        'Caga il giorno di Pasqua',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'SHITTY_FAGGOT',
        'Frocio di merda',
        'Caga durante il Pride Month',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Medium'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'PATRIOTIC_POOP',
        'Merda patriottica',
        'Caga durante il giorno della Repubblica',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'I_SAID_THEY_ARE_SHITS',
        'L''ho detto che sono delle merde!',
        'Colleziona una caccarta Merdume',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'ESCREMENTAL_WATSON',
        'Escrementale, Watson',
        'Colleziona una caccarta Escrementale',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'NOT_EVERYTHING_THAT_SHINES_IS_GOLD',
        'Tutto ciò che splende non è oro',
        'Colleziona una caccarta Sensazianale',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'WHAT_AN_ASSHOLE',
        'Che buco di culo',
        'Colleziona una caccarta Caccasmagorica',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Easy'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'POOP_SOMMELIER',
        'Il sommelier della merda',
        'Colleziona la metà delle caccarte',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'POOPDEX_COMPLETED',
        'Caccadex Completato',
        'Colleziona tutte le caccarte',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Extreme'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'PENTAKILL',
        'Pentakill',
        'Caga 5 volte nello stesso giorno',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'SCAT_LOVER',
        'Scat Lover',
        'Accumula 69 cagate di fila',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Hard'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'ONE_MONTH_OF_SHIT',
        'Un mese di merda',
        'Accumula 30 cagate di fila',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Medium'
        )
    );

INSERT
    OR IGNORE INTO achievement (id, name, description, difficulty_id)
VALUES
    (
        'A_YEAR_OF_SHIT',
        'Un anno di merda',
        'Accumula 365 cagate di fila',
        (
            SELECT
                id
            FROM
                difficulty
            WHERE
                name = 'Extreme'
        )
    );