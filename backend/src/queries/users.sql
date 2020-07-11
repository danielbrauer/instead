/* @name Create */
INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key) RETURNING id;

/* @name GetUserInfo */
SELECT private_key, public_key, muk_salt FROM users WHERE id = :userId;

/* @name CountByName */
SELECT COUNT(*)::int FROM users WHERE username = :username;

/* @name GetById */
SELECT id, username FROM users WHERE id = :userId;

/* @name GetByName */
SELECT id FROM users WHERE username = :username;

/* @name GetLoginInfoByName */
SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username;

