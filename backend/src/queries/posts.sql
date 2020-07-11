/* @name CreateAndReturn */
INSERT INTO posts (filename, author_id, key_set_id, iv) VALUES (:fileName, :authorId, :keySetId, :iv) RETURNING id;

/* @name Publish */
UPDATE posts SET published = true WHERE id = :postId;

/* @name DestroyAndReturn */
DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *;

/* @name DestroyIfUnpublished */
DELETE FROM posts WHERE id = :postId AND published = false RETURNING *;

/* @name GetByAuthorId */
SELECT * FROM posts WHERE published = true AND (author_id = :authorId OR author_id IN (
    SELECT followee_id
    FROM followers
    WHERE followers.follower_id = :authorId
)) ORDER BY timestamp DESC;
