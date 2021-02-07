/* @name Create */
INSERT INTO follow_requests (requester_id, requestee_id, friend_code) VALUES (:requesterId, :requesteeId, :friendCode);

/* @name Destroy */
DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId;

/* @name GetByIds */
SELECT id FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId;

/* @name Count */
SELECT COUNT(*)::int FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId;

/* @name CountByRequesteeId */
SELECT COUNT(*)::int FROM follow_requests WHERE requestee_id = :requesteeId;

/* @name GetByRequesteeId */
SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId;

/* @name GetByRequesterId */
SELECT requestee_id, friend_code FROM follow_requests WHERE requester_id = :requesterId;

/* @name AcceptFollowRequest */
WITH request AS (
    SELECT id, requester_id, requestee_id FROM follow_requests
    WHERE id = :requestId
), relationship AS (
    INSERT INTO follow_relationships (follower_id, followee_id)
    SELECT requester_id, requestee_id FROM request
    RETURNING id
), key AS (
    UPDATE profile_keys
    SET out_follow_relationship_id = (SELECT id FROM relationship)
    WHERE out_follow_request_id = (SELECT id FROM request)
)
DELETE FROM follow_requests
WHERE id = :requestId;