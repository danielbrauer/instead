/* @name GetById */
SELECT id, display_name, display_name_iv FROM users WHERE id = :userId;

/* @name GetByFriendCode */
SELECT id FROM users WHERE friend_code = :friendCode;

/* @name GetFriendCode */
SELECT friend_code FROM users WHERE id = :userId;

/* @name SetFriendCode */
UPDATE users SET friend_code = :friendCode WHERE id = :userId;