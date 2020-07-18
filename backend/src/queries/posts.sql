/* @name CreateAndReturn */
INSERT INTO posts (filename, author_id, key_set_id, iv) VALUES (:fileName, :authorId, :keySetId, :iv) RETURNING id;

/* @name Publish */
UPDATE posts SET published = true WHERE id = :postId;

/* @name DestroyAndReturn */
DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *;

/* @name DestroyIfUnpublished */
DELETE FROM posts WHERE id = :postId AND published = false RETURNING *;

/* @name GetHomePostsWithKeys */
SELECT posts.id, posts.timestamp, posts.author_id, posts.filename, posts.iv,
       keys.jwk
FROM posts, keys
WHERE posts.key_set_id = keys.key_set_id
AND keys.user_id = :authorId
AND posts.published = true
AND (posts.author_id = :authorId OR posts.author_id IN (
    SELECT followee_id
    FROM followers
    WHERE followers.follower_id = :authorId
)) ORDER BY timestamp DESC;
