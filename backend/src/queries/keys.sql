/* @name GetCurrentKey */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
    SELECT id
    FROM key_sets
    WHERE owner_id = :userId AND valid_end IS NULL
);

/* @name GetKey */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id = :keySetId;

/* @name GetAllKeys */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
    SELECT id
    FROM key_sets
    WHERE owner_id = :userId
);

/* @name GetFollowerPublicKeys */
SELECT id, public_key FROM users WHERE id IN (
    SELECT follower_id
    FROM followers
    WHERE followee_id = :userId
);

/* @name GetPublicKey */
SELECT id, public_key FROM users WHERE id = :userId;

/* @name EndKeySetValidity */
UPDATE key_sets SET valid_end = now() WHERE id = :keySetId;

/* @name CreateKeySet */
INSERT INTO key_sets (owner_id) VALUES (:ownerId) RETURNING id;

/*
    @name AddKeys
    @param keys -> ((userId, keySetId, key)...)
*/
INSERT INTO keys (user_id, key_set_id, key)
VALUES :keys;

/* @name RemoveFollowerKeys */
DELETE FROM keys WHERE user_id = :followerId AND key_set_id IN (
    SELECT key_set_id
    FROM key_sets
    WHERE owner_id = :followeeId
);

/* @name GetInfoKey */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
    SELECT info_key_set_id
    FROM users
    WHERE id = :ownerId
);

/* @name SetInfoKey */
UPDATE users SET info_key_set_id = :newKey WHERE id = :userId;