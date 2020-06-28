/* @name Create */
INSERT INTO follow_requests (requester_id, requestee_id) VALUES (:requesterId, :requesteeId);

/* @name Destroy */
DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId;

/* @name DestroyAndReturn */
DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId RETURNING *;

/* @name Count */
SELECT COUNT(*)::int FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId;

/* @name GetByRequesteeId */
SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId;

