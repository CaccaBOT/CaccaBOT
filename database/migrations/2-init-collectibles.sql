INSERT
	OR IGNORE INTO rarity(name, chance)
VALUES
	('Merdume', 59);

INSERT
	OR IGNORE INTO rarity(name, chance)
VALUES
	('Escrementale', 30);

INSERT
	OR IGNORE INTO rarity(name, chance)
VALUES
	('Sensazianale', 10);

INSERT
	OR IGNORE INTO rarity(name, chance)
VALUES
	('Caccasmagorico', 1);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Jeff Merdos',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Sensazianale'
		),
		'https://caccabot.duckdns.org/public/collectibles/jeffmerdos.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Scopino',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/scopino.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Cesso',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/cesso.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Carta Igienica',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/cartaigienica.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Cacapops',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/cacapops.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Una giornata di merda',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Caccasmagorico'
		),
		'https://caccabot.duckdns.org/public/collectibles/una_giornata_di_merda.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Supercacca',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot.duckdns.org/public/collectibles/supercacca.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Merdinfiore',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot.duckdns.org/public/collectibles/merdinfiore.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Merdangelo',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot.duckdns.org/public/collectibles/merdangelo.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Gelano',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/gelano.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Cesso di Jeff Merdos',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Caccasmagorico'
		),
		'https://caccabot.duckdns.org/public/collectibles/cesso_jeff_merdos.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Cacca Samurai',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot.duckdns.org/public/collectibles/caccasamurai.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Caccantante',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Sensazianale'
		),
		'https://caccabot.duckdns.org/public/collectibles/caccantante.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Cheesmerdo',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/cheesmerdo.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Merdella',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot.duckdns.org/public/collectibles/merdella.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Merdiamante',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot.duckdns.org/public/collectibles/merdiamante.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Caccodè',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/caccode.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Fontanale',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/fontanale.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Micismerdo',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/micismerdo.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Caccometa',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Sensazianale'
		),
		'https://caccabot.duckdns.org/public/collectibles/caccometa.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Merdavid',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot.duckdns.org/public/collectibles/merdavid.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Merdapocalypse',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Caccasmagorico'
		),
		'https://caccabot.duckdns.org/public/collectibles/merdapocalypse.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Lumacano',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Merdume'
		),
		'https://caccabot.duckdns.org/public/collectibles/lumacano.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Cacca Hacker',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Sensazianale'
		),
		'https://caccabot.duckdns.org/public/collectibles/caccahacker.webp'
	);