/* @name GetCurrentKey */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
    SELECT id
    FROM key_sets
    WHERE owner_id = :userId AND valid_end IS NULL
);

/* @name GetFollowerPublicKeys */
SELECT id, public_key FROM users WHERE id IN (
    SELECT follower_id
    FROM followers
    WHERE followee_id = :userId
);

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
