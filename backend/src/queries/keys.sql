/* @name GetFollowerPublicKeys */
SELECT id, public_key FROM users WHERE id IN (
    SELECT follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
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

/* @name GetProfileKey */
SELECT * FROM profile_keys WHERE recipient_id = :recipientId AND owner_id = :ownerId;

/* @name GetCurrentProfileKey */
SELECT profile_keys.key
FROM profile_keys, users
WHERE profile_keys.owner_id = users.id
AND profile_keys.recipient_id = :userId
AND profile_keys.owner_id = :userId
AND users.profile_key_stale = false;

/* @name CreateProfileKey */
WITH dummy AS (
    DELETE FROM profile_keys WHERE owner_id = :userId
), dummy2 AS (
    UPDATE users SET profile_key_stale = false WHERE id = :userId
)
INSERT INTO profile_keys (recipient_id, owner_id, key)
VALUES (:userId, :userId, :key);

/*
    @name AddProfileKeys
    @param keysWithSupportingRelationshipIds -> ((recipientId, ownerId, key, outFollowRequestId, outFollowRelationshipId, inFollowRelationshipId)...)
*/
INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)
VALUES :keysWithSupportingRelationshipIds;
