/* @name GetActivityForUser */
SELECT comments.id, comments.author_id, comments.published,
       posts.id AS post_id
FROM comments, posts
WHERE comments.post_id = posts.id
AND posts.author_id = :userId
AND comments.author_id <> :userId
ORDER BY comments.published DESC;

/* @name GetRecentActivityCount */

SELECT COUNT(*)
FROM comments, posts
WHERE comments.post_id = posts.id
AND posts.author_id = :userId
AND comments.author_id <> :userId
AND comments.published > (
    SELECT activity_last_checked FROM users WHERE id = :userId
);