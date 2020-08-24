/* @name GetKey */
SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId;

/* @name GetFollowerPublicKeys */
SELECT id, public_key FROM users WHERE id IN (
    SELECT follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
);

/* @name GetPublicKey */
SELECT id, public_key FROM users WHERE id = :userId;

/* @name GetCurrentPostKey */
SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (
    SELECT id
    FROM post_key_sets
    WHERE owner_id = :userId AND valid_end IS NULL
);

/* @name GetAllPostKeys */
SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (
    SELECT id
    FROM post_key_sets
    WHERE owner_id = :userId
);

/* @name EndCurrentPostKeySetValidity */
UPDATE post_key_sets
SET valid_end = now()
WHERE owner_id = :userId AND valid_end IS NULL;

/* @name CreateCurrentPostKeySet */
WITH new_post_key_set_id AS (
    INSERT INTO post_key_sets (owner_id)
    VALUES (:ownerId)
    RETURNING id
)
INSERT INTO post_keys (recipient_id, post_key_set_id, key)
VALUES (:ownerId, (SELECT * FROM new_post_key_set_id), :key)
RETURNING post_key_set_id;

/*
    @name AddPostKeys
    @param keysWithFollowerIds -> ((recipientId, postKeySetId, key, followRelationshipId)...)
*/
INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)
VALUES :keysWithFollowerIds;
