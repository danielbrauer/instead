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

