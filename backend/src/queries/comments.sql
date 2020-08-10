/* @name Create */
INSERT INTO comments (author_id, key_set_id, post_id, content, content_iv)
VALUES (:authorId, :keySetId, :postId, :content, :contentIv);

/* @name Destroy */
DELETE FROM comments WHERE id = :commentId AND author_id = :authorId;

/* @name GetCommentsForPost */
SELECT comments.id, comments.author_id, comments.content, comments.content_iv,
       keys.key
FROM comments, keys
WHERE comments.post_id = :postId
AND comments.key_set_id = keys.key_set_id
AND keys.user_id = :userId
ORDER BY published DESC;