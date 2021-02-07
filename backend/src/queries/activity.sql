/* @name GetActivityForUser */
SELECT comments.id, comments.author_id, comments.published, timestamp_to_int(comments.published) AS index,
       posts.id AS post_id
FROM comments, posts
WHERE comments.post_id = posts.id
AND posts.author_id = :userId
AND comments.author_id <> :userId
AND comments.published IS NOT NULL
AND (:pageIndex::int8 IS NULL OR comments.published < int_to_timestamp(:pageIndex::int8))
ORDER BY comments.published DESC
LIMIT 3;

/* @name GetRecentActivityCount */

SELECT COUNT(*)
FROM comments, posts
WHERE comments.post_id = posts.id
AND posts.author_id = :userId
AND comments.author_id <> :userId
AND comments.published > (
    SELECT activity_last_checked FROM users WHERE id = :userId
);