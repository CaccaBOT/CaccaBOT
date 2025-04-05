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
		'https://caccabot-assets.pages.dev/collectibles/jeffmerdos.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/scopino.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/cesso.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/cartaigienica.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/cacapops.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/una_giornata_di_merda.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/supercacca.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/merdinfiore.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/merdangelo.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/gelano.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/cesso_jeff_merdos.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/caccasamurai.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/caccantante.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/cheesmerdo.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/merdella.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/merdiamante.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/caccode.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/fontanale.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/micismerdo.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/caccometa.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/merdavid.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/merdapocalypse.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/lumacano.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/caccahacker.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/cagamella.webp'
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
		'https://caccabot-assets.pages.dev/collectibles/caccompleanno.webp'
	);