/* @name SetCurrentKeySetId */
UPDATE users SET current_post_key_set = :keySetId WHERE id = :userId;

/* @name GetCurrentKeySetId */
SELECT current_post_key_set FROM users WHERE id = :userId;

/* @name GetCurrentKey */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
    SELECT current_post_key_set
    FROM users
    WHERE id = :userId
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
    @param keys -> ((user_id, key_set_id, jwk)...)
*/
INSERT INTO keys (user_id, key_set_id, jwk)
VALUES :keys;