/* @name CreateAndReturn */
INSERT INTO post_upgrades (post_id, encrypted_info, filename, version) VALUES (:postId, :encryptedInfo, :fileName, :version) RETURNING id;

/* @name ApplyAndDelete */
WITH post_upgrade AS (
    SELECT id, post_id, encrypted_info, filename, version FROM post_upgrades
    WHERE id = :upgradeId
), post AS (
    UPDATE posts SET (encrypted_info, filename, version) = (SELECT encrypted_info, filename, version FROM post_upgrade)
    WHERE id = (SELECT post_id FROM post_upgrade)
)
DELETE FROM post_upgrades
WHERE id = (SELECT id FROM post_upgrade);