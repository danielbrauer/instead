/* @name Create */
INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key, :private_key_iv) RETURNING id;

/* @name CountByName */
SELECT COUNT(*)::int FROM users WHERE username = :username;

/* @name GetById */
SELECT id, username FROM users WHERE id = :userId;

/* @name GetByName */
SELECT id FROM users WHERE username = :username;

/* @name GetLoginInfoByName */
SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username;

