/* @name CreateAndReturn */
INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key) RETURNING id;

/* @name DestroyAndReturn */
DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *;

/* @name GetByAuthorId */
SELECT * FROM posts WHERE author_id = :authorId OR author_id IN (
    SELECT followee_id
    FROM followers
    WHERE followers.follower_id = :authorId
) ORDER BY timestamp DESC;
