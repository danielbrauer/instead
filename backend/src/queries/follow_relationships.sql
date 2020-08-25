/* @name Create */
WITH relationship AS (
    INSERT INTO follow_relationships (follower_id, followee_id)
    VALUES (:followerId, :followeeId)
    RETURNING id
)
UPDATE profile_keys
SET in_follow_relationship_id = (SELECT id FROM relationship)
WHERE owner_id = :followeeId
AND recipient_id = :followerId;

/* @name Destroy */
DELETE FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId RETURNING follower_id, followee_id;

/* @name Count */
SELECT COUNT(*)::int FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId;

/* @name GetByFolloweeId */
SELECT id, follower_id FROM follow_relationships WHERE followee_id = :followeeId;

/* @name GetByFollowerId */
SELECT followee_id FROM follow_relationships WHERE follower_id = :followerId;

/* @name GetExact */
SELECT id FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId;