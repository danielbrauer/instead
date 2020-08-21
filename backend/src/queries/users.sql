/* @name Create */
INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv)
VALUES (:username, :displayName, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv)
RETURNING id;

/* @name GetUserInfo */
SELECT private_key, private_key_iv, public_key, muk_salt, friend_code FROM users WHERE id = :userId;

/* @name CountByName */
SELECT COUNT(*)::int FROM users WHERE username = :username;

/* @name GetById */
SELECT id, username, display_name FROM users WHERE id = :userId;

/* @name GetByFriendCode */
SELECT id FROM users WHERE friend_code = :friendCode;

/* @name GetLoginInfoByName */
SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username;

/* @name SetFriendCode */
UPDATE users SET friend_code = :friendCode WHERE id = :userId;