PRAGMA foreign_keys=OFF;

BEGIN TRANSACTION;

CREATE TEMP TABLE id_map AS
SELECT id AS old_id, discordId AS new_id
FROM user
WHERE discordId IS NOT NULL AND id != discordId;

UPDATE poop
SET user_id = (
    SELECT new_id FROM id_map WHERE poop.user_id = id_map.old_id
)
WHERE user_id IN (SELECT old_id FROM id_map);

UPDATE user_collectible
SET user_id = (
    SELECT new_id FROM id_map WHERE user_collectible.user_id = id_map.old_id
)
WHERE user_id IN (SELECT old_id FROM id_map);

UPDATE user_achievement
SET user_id = (
    SELECT new_id FROM id_map WHERE user_achievement.user_id = id_map.old_id
)
WHERE user_id IN (SELECT old_id FROM id_map);

UPDATE "order"
SET user_id = (
    SELECT new_id FROM id_map WHERE "order".user_id = id_map.old_id
)
WHERE user_id IN (SELECT old_id FROM id_map);

UPDATE user
SET id = discordId
WHERE discordId IS NOT NULL AND id != discordId;

ALTER TABLE user DROP COLUMN discordId;
ALTER TABLE user DROP COLUMN phone;
ALTER TABLE user DROP COLUMN "password";

COMMIT;
