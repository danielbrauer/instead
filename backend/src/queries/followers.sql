/* @name Create */
INSERT INTO followers (follower_id, followee_id) VALUES (:followerId, :followeeId);

/* @name Destroy */
DELETE FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId RETURNING follower_id, followee_id;

/* @name Count */
SELECT COUNT(*)::int FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId;

/* @name GetByFolloweeId */
SELECT follower_id FROM followers WHERE followee_id = :followeeId;

/* @name GetByFollowerId */
SELECT followee_id FROM followers WHERE follower_id = :followerId;

