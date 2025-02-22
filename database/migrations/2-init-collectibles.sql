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
		'https://caccabot-collectibles.pages.dev/jeffmerdos.webp'
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
		'https://caccabot-collectibles.pages.dev/scopino.webp'
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
		'https://caccabot-collectibles.pages.dev/cesso.webp'
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
		'https://caccabot-collectibles.pages.dev/cartaigienica.webp'
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
		'https://caccabot-collectibles.pages.dev/cacapops.webp'
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
		'https://caccabot-collectibles.pages.dev/una_giornata_di_merda.webp'
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
		'https://caccabot-collectibles.pages.dev/supercacca.webp'
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
		'https://caccabot-collectibles.pages.dev/merdinfiore.webp'
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
		'https://caccabot-collectibles.pages.dev/merdangelo.webp'
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
		'https://caccabot-collectibles.pages.dev/gelano.webp'
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
		'https://caccabot-collectibles.pages.dev/cesso_jeff_merdos.webp'
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
		'https://caccabot-collectibles.pages.dev/caccasamurai.webp'
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
		'https://caccabot-collectibles.pages.dev/caccantante.webp'
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
		'https://caccabot-collectibles.pages.dev/cheesmerdo.webp'
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
		'https://caccabot-collectibles.pages.dev/merdella.webp'
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
		'https://caccabot-collectibles.pages.dev/merdiamante.webp'
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
		'https://caccabot-collectibles.pages.dev/caccode.webp'
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
		'https://caccabot-collectibles.pages.dev/fontanale.webp'
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
		'https://caccabot-collectibles.pages.dev/micismerdo.webp'
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
		'https://caccabot-collectibles.pages.dev/caccometa.webp'
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
		'https://caccabot-collectibles.pages.dev/merdavid.webp'
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
		'https://caccabot-collectibles.pages.dev/merdapocalypse.webp'
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
		'https://caccabot-collectibles.pages.dev/lumacano.webp'
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
		'https://caccabot-collectibles.pages.dev/caccahacker.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Cagamella',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Escrementale'
		),
		'https://caccabot-collectibles.pages.dev/cagamella.webp'
	);

INSERT
	OR IGNORE INTO collectible (name, description, rarity_id, asset_url)
VALUES
	(
		'Caccompleanno',
		NULL,
		(
			SELECT
				id
			FROM
				rarity
			WHERE
				name = 'Sensazianale'
		),
		'https://caccabot-collectibles.pages.dev/caccompleanno.webp'
	);