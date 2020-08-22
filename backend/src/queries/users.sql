/* @name Create */
INSERT INTO users (username, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv)
VALUES (:username, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv)
RETURNING id;

/* @name GetUserInfo */
SELECT private_key, private_key_iv, public_key, muk_salt FROM users WHERE id = :userId;

/* @name GetLoginInfoByName */
SELECT id, username, srp_salt, verifier FROM users WHERE username = :username;

/* @name CountByName */
SELECT COUNT(*)::int FROM users WHERE username = :username;

/* @name GetById */
SELECT id, display_name, display_name_iv FROM users WHERE id = :userId;

/* @name GetByFriendCode */
SELECT id FROM users WHERE friend_code = :friendCode;

/* @name GetFriendCode */
SELECT friend_code FROM users WHERE id = :userId;

/* @name SetFriendCode */
UPDATE users SET friend_code = :friendCode WHERE id = :userId;