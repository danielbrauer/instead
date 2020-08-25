/* @name GetProfileWithKey */
SELECT users.id, users.display_name, users.display_name_iv,
       profile_keys.key
FROM users, profile_keys
WHERE users.id = profile_keys.owner_id
AND users.id = :userId
AND profile_keys.recipient_id = :requesterId;

/* @name SetProfileData */
UPDATE users SET display_name = :displayName, display_name_iv = :displayNameIv WHERE id = :userId;

/* @name GetByFriendCode */
SELECT id FROM users WHERE friend_code = :friendCode;

/* @name GetFriendCode */
SELECT friend_code FROM users WHERE id = :userId;

/* @name SetFriendCode */
UPDATE users SET friend_code = :friendCode WHERE id = :userId;