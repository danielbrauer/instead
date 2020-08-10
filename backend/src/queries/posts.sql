/* @name CreateAndReturn */
INSERT INTO posts (filename, author_id, key_set_id, iv, aspect) VALUES (:fileName, :authorId, :keySetId, :iv, :aspect) RETURNING id;

/* @name Publish */
UPDATE posts SET published = NOW() WHERE id = :postId;

/* @name DestroyAndReturn */
DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *;

/* @name DestroyIfUnpublished */
DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *;

/* @name GetHomePostsWithKeys */
SELECT posts.id, posts.published, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
       keys.key
FROM posts, keys
WHERE posts.key_set_id = keys.key_set_id
AND keys.user_id = :authorId
AND posts.published IS NOT NULL
AND (posts.author_id = :authorId OR posts.author_id IN (
    SELECT followee_id
    FROM followers
    WHERE followers.follower_id = :authorId
)) ORDER BY published DESC;

/* @name GetPostWithKey */
SELECT posts.id, posts.published, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
       keys.key
FROM posts, keys
WHERE posts.key_set_id = keys.key_set_id
AND keys.user_id = :requesterId
AND posts.published IS NOT NULL
AND posts.id = :postId;