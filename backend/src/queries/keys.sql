/* @name GetCurrentPostKey */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
    SELECT current_post_key_set_id
    FROM users
    WHERE id = :userId
);

/* @name GetKey */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id = :keySetId;

/* @name GetAllPostKeys */
SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
    SELECT id
    FROM key_sets
    WHERE owner_id = :userId
);

/* @name GetFollowerPublicKeys */
SELECT id, public_key FROM users WHERE id IN (
    SELECT follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
);

/* @name GetPublicKey */
SELECT id, public_key FROM users WHERE id = :userId;

/* @name EndPostKeySetValidity */
WITH old_post_key AS (
    SELECT current_post_key_set_id
    FROM users
    WHERE id = :userId
), dummy AS (
    UPDATE users
    SET current_post_key_set_id = NULL
    where id = :userId
)
UPDATE key_sets SET valid_end = now() WHERE id = (SELECT * FROM old_post_key);

/* @name CreateCurrentPostKeySet */
WITH new_key_set_id AS (
    INSERT INTO key_sets (owner_id)
    VALUES (:ownerId)
    RETURNING id
), dummy AS (
    UPDATE users
    SET current_post_key_set_id = (SELECT * FROM new_key_set_id)
    WHERE id = :ownerId
)
INSERT INTO keys (user_id, key_set_id, key)
VALUES (:ownerId, (SELECT * FROM new_key_set_id), :key)
RETURNING key_set_id;

/*
    @name AddPostKeys
    @param keysWithFollowerIds -> ((userId, keySetId, key, followRelationshipId)...)
*/
INSERT INTO keys (user_id, key_set_id, key, follow_relationship_id)
VALUES :keysWithFollowerIds;