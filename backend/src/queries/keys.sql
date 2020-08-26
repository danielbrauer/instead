/* @name GetFollowerPublicKeys */
SELECT id, public_key FROM users WHERE id IN (
    SELECT follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
);

/* @name GetProfileViewerPublicKeys */
SELECT users.id, users.public_key
FROM users
WHERE users.id IN (
    SELECT follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
)
OR users.id IN (
    SELECT followee_id
    FROM follow_relationships
    WHERE follower_id = :userId
)
OR users.id IN (
    SELECT requestee_id
    FROM follow_requests
    WHERE requester_id = :userId
);

/* @name GetPublicKey */
SELECT id, public_key FROM users WHERE id = :userId;

/* @name GetPostKey */
SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId;

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

/* @name GetCurrentProfileKey */
SELECT profile_keys.key,
       users.profile_key_stale
FROM profile_keys, users
WHERE profile_keys.owner_id = users.id
AND profile_keys.recipient_id = :userId
AND profile_keys.owner_id = :userId;

/*
    @name CreateProfileKey
    @param viewerKeys -> ((recipientId, ownerId, key)...)
*/
WITH dummy AS (
    DELETE FROM profile_keys WHERE owner_id = :userId
), dummy2 AS (
    INSERT INTO profile_keys (recipient_id, owner_id, key)
    VALUES (:userId, :userId, :key)
), dummy3 AS (
    INSERT INTO profile_keys (recipient_id, owner_id, key)
    VALUES :viewerKeys
)
UPDATE users SET profile_key_stale = false WHERE id = :userId;

/* @name AddProfileKey */
WITH dummy AS (
    DELETE FROM profile_keys WHERE owner_id = :userId AND recipient_id = :recipientId
)
INSERT INTO profile_keys (recipient_id, owner_id, key)
VALUES (:recipientId, :ownerId, :key);