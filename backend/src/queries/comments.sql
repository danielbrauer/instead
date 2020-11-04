/* @name Create */
INSERT INTO comments (author_id, post_key_set_id, post_id, content, content_iv)
VALUES (:authorId, :keySetId, :postId, :content, :contentIv);

/* @name Destroy */
DELETE FROM comments WHERE id = :commentId AND author_id = :authorId;

/* @name GetCommentsForPost */
SELECT comments.id, comments.author_id, comments.content, comments.content_iv, comments.published,
       post_keys.key,
       count(*) OVER()::int AS full_count
FROM comments, post_keys
WHERE comments.post_id = :postId
AND comments.post_key_set_id = post_keys.post_key_set_id
AND post_keys.recipient_id = :userId
ORDER BY published
LIMIT :limit::int;