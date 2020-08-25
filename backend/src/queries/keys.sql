/* @name GetFollowerPublicKeys */
SELECT id, public_key FROM users WHERE id IN (
    SELECT follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
);

/* @name GetProfileViewerPublicKeys */
WITH in_rels AS (
    SELECT id, follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
),
out_rels AS (
    SELECT id, followee_id
    FROM follow_relationships
    WHERE follower_id = :userId
),
out_reqs AS (
    SELECT id, requestee_id
    FROM follow_requests
    WHERE requester_id = :userId
)
SELECT users.id AS recipient_id, users.public_key,
       in_rels.id AS in_follow_relationship_id,
       out_rels.id AS out_follow_relationship_id,
       out_reqs.id AS out_follow_request_id
FROM ((users FULL JOIN in_rels ON users.id = in_rels.follower_id)
FULL JOIN out_rels ON users.id = out_rels.followee_id)
FULL JOIN out_reqs ON users.id = out_reqs.requestee_id
WHERE in_rels.id IS NOT NULL
OR out_rels.id IS NOT NULL
OR out_reqs.id IS NOT NULL;

/* @name GetProfileViewerPublicKey */
WITH in_rels AS (
    SELECT id, follower_id
    FROM follow_relationships
    WHERE followee_id = :userId
    AND follower_id = :viewerId
),
out_rels AS (
    SELECT id, followee_id
    FROM follow_relationships
    WHERE follower_id = :userId
    AND followee_id = :viewerId
),
out_reqs AS (
    SELECT id, requestee_id
    FROM follow_requests
    WHERE requester_id = :userId
    AND requestee_id = :viewerId
)
SELECT users.id AS recipient_id, users.public_key,
       in_rels.id AS in_follow_relationship_id,
       out_rels.id AS out_follow_relationship_id,
       out_reqs.id AS out_follow_request_id
FROM ((users FULL JOIN in_rels ON users.id = in_rels.follower_id)
FULL JOIN out_rels ON users.id = out_rels.followee_id)
FULL JOIN out_reqs ON users.id = out_reqs.requestee_id
WHERE users.id = :viewerId;


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
    @param keysWithSupportingRelationshipIds -> ((recipientId, ownerId, key, outFollowRequestId, outFollowRelationshipId, inFollowRelationshipId)...)
*/
WITH dummy AS (
    DELETE FROM profile_keys WHERE owner_id = :userId
), dummy2 AS (
    INSERT INTO profile_keys (recipient_id, owner_id, key)
    VALUES (:userId, :userId, :key)
), dummy3 AS (
    INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)
    VALUES :keysWithSupportingRelationshipIds
)
UPDATE users SET profile_key_stale = false WHERE id = :userId;

/* @name AddProfileKey */
WITH dummy AS (
    DELETE FROM profile_keys WHERE owner_id = :userId AND recipient_id = :recipientId
)
INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)
VALUES (:recipientId, :ownerId, :key, :outFollowRequestId, :outFollowRelationshipId, :inFollowRelationshipId);