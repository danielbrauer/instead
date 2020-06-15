/* @name FindUserById */
SELECT id, username FROM users WHERE id = :userId;

/* @name FindUserByName */
SELECT id FROM users WHERE username = :username;

/* @name CountUsersByName */
SELECT COUNT(*) FROM users WHERE username = :username;

/* @name GetUserLoginInfoByName */
SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username;

/* @name CreateUser */
INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key, :private_key_iv) RETURNING id;

/* @name CountFollowersById */
SELECT COUNT(*) FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId;

/* @name CountFollowRequestsById */
SELECT COUNT(*) FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId;

/* @name InsertFollowRequest */
INSERT INTO follow_requests (requester_id, requestee_id) VALUES (:requesterId, :requesteeId);

/* @name CreatePost */
INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key);

/* @name GetPostsByAuthorId */
SELECT * FROM posts WHERE author_id = :authorId OR author_id IN (
    SELECT followee_id
    FROM followers
    WHERE followers.follower_id = :authorId
) ORDER BY timestamp DESC;

/* @name DeletePostAndReturn */
DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *;

/* @name GetFollowRequestsByRequesteeId */
SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId;

/* @name GetFollowersByFolloweeId */
SELECT follower_id FROM followers WHERE followee_id = :followeeId;

/* @name GetFolloweesByFollowerId */
SELECT followee_id FROM followers WHERE follower_id = :followerId;

/* @name DeleteFollower */
DELETE FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId;

/* @name DeleteFollowRequest */
DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId;

/* @name DeleteFollowRequestAndReturn */
DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId RETURNING *;

/* @name AddFollower */
INSERT INTO followers (follower_id, followee_id) VALUES (:followerId, :followeeId);