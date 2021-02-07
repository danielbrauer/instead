/* @name CreateAndReturn */
INSERT INTO posts (filename, author_id, post_key_set_id, iv, encrypted_info) VALUES (:fileName, :authorId, :postKeySetId, :iv, :encryptedInfo) RETURNING id;

/* @name Publish */
UPDATE posts SET published = NOW() WHERE id = :postId;

/* @name DestroyAndReturn */
DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *;

/* @name DestroyIfUnpublished */
DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *;

/* @name GetHomePostsWithKeys */
SELECT posts.id, posts.version, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,
       post_keys.key
FROM posts, post_keys
WHERE posts.post_key_set_id = post_keys.post_key_set_id
AND post_keys.recipient_id = :recipientId
AND (posts.author_id = :recipientId OR posts.author_id IN (
    SELECT followee_id
    FROM follow_relationships
    WHERE follow_relationships.follower_id = :recipientId
))
AND posts.published IS NOT NULL
AND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))
ORDER BY posts.published DESC
LIMIT 2;

/* @name GetUserPostsWithKeys */
SELECT posts.id, posts.version, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,
       post_keys.key
FROM posts, post_keys
WHERE posts.post_key_set_id = post_keys.post_key_set_id
AND post_keys.recipient_id = :recipientId
AND posts.author_id = :userId
AND posts.published IS NOT NULL
AND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))
ORDER BY posts.published DESC
LIMIT 2;

/* @name GetPostWithKey */
SELECT posts.id, posts.version, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,
       post_keys.key
FROM posts, post_keys
WHERE posts.post_key_set_id = post_keys.post_key_set_id
AND post_keys.recipient_id = :recipientId
AND posts.published IS NOT NULL
AND posts.id = :postId;