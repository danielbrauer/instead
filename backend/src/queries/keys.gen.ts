/** Types generated for queries found in "./src/queries/keys.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetFollowerPublicKeys' parameters type */
export interface IGetFollowerPublicKeysParams {
  userId: number | null | void;
}

/** 'GetFollowerPublicKeys' return type */
export interface IGetFollowerPublicKeysResult {
  id: number;
  publicKey: Json;
}

/** 'GetFollowerPublicKeys' query type */
export interface IGetFollowerPublicKeysQuery {
  params: IGetFollowerPublicKeysParams;
  result: IGetFollowerPublicKeysResult;
}

const getFollowerPublicKeysIR: any = {"name":"GetFollowerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":159,"b":164,"line":5,"col":25}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id IN (\n    SELECT follower_id\n    FROM follow_relationships\n    WHERE followee_id = :userId\n)","loc":{"a":34,"b":166,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, public_key FROM users WHERE id IN (
 *     SELECT follower_id
 *     FROM follow_relationships
 *     WHERE followee_id = :userId
 * )
 * ```
 */
export const getFollowerPublicKeys = new PreparedQuery<IGetFollowerPublicKeysParams,IGetFollowerPublicKeysResult>(getFollowerPublicKeysIR);


/** 'GetProfileViewerPublicKeys' parameters type */
export interface IGetProfileViewerPublicKeysParams {
  userId: number | null | void;
}

/** 'GetProfileViewerPublicKeys' return type */
export interface IGetProfileViewerPublicKeysResult {
  recipientId: number;
  publicKey: Json;
  inFollowRelationshipId: number;
  outFollowRelationshipId: number;
  outFollowRequestId: number;
}

/** 'GetProfileViewerPublicKeys' query type */
export interface IGetProfileViewerPublicKeysQuery {
  params: IGetProfileViewerPublicKeysParams;
  result: IGetProfileViewerPublicKeysResult;
}

const getProfileViewerPublicKeysIR: any = {"name":"GetProfileViewerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":309,"b":314,"line":12,"col":25},{"a":415,"b":420,"line":17,"col":25},{"a":518,"b":523,"line":22,"col":26}]}}],"usedParamSet":{"userId":true},"statement":{"body":"WITH in_rels AS (\n    SELECT id, follower_id\n    FROM follow_relationships\n    WHERE followee_id = :userId\n),\nout_rels AS (\n    SELECT id, followee_id\n    FROM follow_relationships\n    WHERE follower_id = :userId\n),\nout_reqs AS (\n    SELECT id, requestee_id\n    FROM follow_requests\n    WHERE requester_id = :userId\n)\nSELECT users.id AS recipient_id, users.public_key,\n       in_rels.id AS in_follow_relationship_id,\n       out_rels.id AS out_follow_relationship_id,\n       out_reqs.id AS out_follow_request_id\nFROM ((users FULL JOIN in_rels ON users.id = in_rels.follower_id)\nFULL JOIN out_rels ON users.id = out_rels.followee_id)\nFULL JOIN out_reqs ON users.id = out_reqs.requestee_id\nWHERE in_rels.id IS NOT NULL\nOR out_rels.id IS NOT NULL\nOR out_reqs.id IS NOT NULL","loc":{"a":209,"b":977,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH in_rels AS (
 *     SELECT id, follower_id
 *     FROM follow_relationships
 *     WHERE followee_id = :userId
 * ),
 * out_rels AS (
 *     SELECT id, followee_id
 *     FROM follow_relationships
 *     WHERE follower_id = :userId
 * ),
 * out_reqs AS (
 *     SELECT id, requestee_id
 *     FROM follow_requests
 *     WHERE requester_id = :userId
 * )
 * SELECT users.id AS recipient_id, users.public_key,
 *        in_rels.id AS in_follow_relationship_id,
 *        out_rels.id AS out_follow_relationship_id,
 *        out_reqs.id AS out_follow_request_id
 * FROM ((users FULL JOIN in_rels ON users.id = in_rels.follower_id)
 * FULL JOIN out_rels ON users.id = out_rels.followee_id)
 * FULL JOIN out_reqs ON users.id = out_reqs.requestee_id
 * WHERE in_rels.id IS NOT NULL
 * OR out_rels.id IS NOT NULL
 * OR out_reqs.id IS NOT NULL
 * ```
 */
export const getProfileViewerPublicKeys = new PreparedQuery<IGetProfileViewerPublicKeysParams,IGetProfileViewerPublicKeysResult>(getProfileViewerPublicKeysIR);


/** 'GetProfileViewerPublicKey' parameters type */
export interface IGetProfileViewerPublicKeyParams {
  userId: number | null | void;
  viewerId: number | null | void;
}

/** 'GetProfileViewerPublicKey' return type */
export interface IGetProfileViewerPublicKeyResult {
  recipientId: number;
  publicKey: Json;
  inFollowRelationshipId: number;
  outFollowRelationshipId: number;
  outFollowRequestId: number;
}

/** 'GetProfileViewerPublicKey' query type */
export interface IGetProfileViewerPublicKeyQuery {
  params: IGetProfileViewerPublicKeyParams;
  result: IGetProfileViewerPublicKeyResult;
}

const getProfileViewerPublicKeyIR: any = {"name":"GetProfileViewerPublicKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1119,"b":1124,"line":39,"col":25},{"a":1257,"b":1262,"line":45,"col":25},{"a":1392,"b":1397,"line":51,"col":26}]}},{"name":"viewerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1149,"b":1156,"line":40,"col":23},{"a":1287,"b":1294,"line":46,"col":23},{"a":1423,"b":1430,"line":52,"col":24},{"a":1821,"b":1828,"line":61,"col":18}]}}],"usedParamSet":{"userId":true,"viewerId":true},"statement":{"body":"WITH in_rels AS (\n    SELECT id, follower_id\n    FROM follow_relationships\n    WHERE followee_id = :userId\n    AND follower_id = :viewerId\n),\nout_rels AS (\n    SELECT id, followee_id\n    FROM follow_relationships\n    WHERE follower_id = :userId\n    AND followee_id = :viewerId\n),\nout_reqs AS (\n    SELECT id, requestee_id\n    FROM follow_requests\n    WHERE requester_id = :userId\n    AND requestee_id = :viewerId\n)\nSELECT users.id AS recipient_id, users.public_key,\n       in_rels.id AS in_follow_relationship_id,\n       out_rels.id AS out_follow_relationship_id,\n       out_reqs.id AS out_follow_request_id\nFROM ((users FULL JOIN in_rels ON users.id = in_rels.follower_id)\nFULL JOIN out_rels ON users.id = out_rels.followee_id)\nFULL JOIN out_reqs ON users.id = out_reqs.requestee_id\nWHERE users.id = :viewerId","loc":{"a":1019,"b":1828,"line":36,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH in_rels AS (
 *     SELECT id, follower_id
 *     FROM follow_relationships
 *     WHERE followee_id = :userId
 *     AND follower_id = :viewerId
 * ),
 * out_rels AS (
 *     SELECT id, followee_id
 *     FROM follow_relationships
 *     WHERE follower_id = :userId
 *     AND followee_id = :viewerId
 * ),
 * out_reqs AS (
 *     SELECT id, requestee_id
 *     FROM follow_requests
 *     WHERE requester_id = :userId
 *     AND requestee_id = :viewerId
 * )
 * SELECT users.id AS recipient_id, users.public_key,
 *        in_rels.id AS in_follow_relationship_id,
 *        out_rels.id AS out_follow_relationship_id,
 *        out_reqs.id AS out_follow_request_id
 * FROM ((users FULL JOIN in_rels ON users.id = in_rels.follower_id)
 * FULL JOIN out_rels ON users.id = out_rels.followee_id)
 * FULL JOIN out_reqs ON users.id = out_reqs.requestee_id
 * WHERE users.id = :viewerId
 * ```
 */
export const getProfileViewerPublicKey = new PreparedQuery<IGetProfileViewerPublicKeyParams,IGetProfileViewerPublicKeyResult>(getProfileViewerPublicKeyIR);


/** 'GetPublicKey' parameters type */
export interface IGetPublicKeyParams {
  userId: number | null | void;
}

/** 'GetPublicKey' return type */
export interface IGetPublicKeyResult {
  id: number;
  publicKey: Json;
}

/** 'GetPublicKey' query type */
export interface IGetPublicKeyQuery {
  params: IGetPublicKeyParams;
  result: IGetPublicKeyResult;
}

const getPublicKeyIR: any = {"name":"GetPublicKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1903,"b":1908,"line":65,"col":45}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id = :userId","loc":{"a":1858,"b":1908,"line":65,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, public_key FROM users WHERE id = :userId
 * ```
 */
export const getPublicKey = new PreparedQuery<IGetPublicKeyParams,IGetPublicKeyResult>(getPublicKeyIR);


/** 'GetPostKey' parameters type */
export interface IGetPostKeyParams {
  userId: number | null | void;
  keySetId: number | null | void;
}

/** 'GetPostKey' return type */
export interface IGetPostKeyResult {
  key: string;
  recipientId: number;
  postKeySetId: number;
  id: number;
  followRelationshipId: number | null;
}

/** 'GetPostKey' query type */
export interface IGetPostKeyQuery {
  params: IGetPostKeyParams;
  result: IGetPostKeyResult;
}

const getPostKeyIR: any = {"name":"GetPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1981,"b":1986,"line":68,"col":46}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2011,"b":2018,"line":68,"col":76}]}}],"usedParamSet":{"userId":true,"keySetId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId","loc":{"a":1935,"b":2018,"line":68,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId
 * ```
 */
export const getPostKey = new PreparedQuery<IGetPostKeyParams,IGetPostKeyResult>(getPostKeyIR);


/** 'GetCurrentPostKey' parameters type */
export interface IGetCurrentPostKeyParams {
  userId: number | null | void;
}

/** 'GetCurrentPostKey' return type */
export interface IGetCurrentPostKeyResult {
  key: string;
  recipientId: number;
  postKeySetId: number;
  id: number;
  followRelationshipId: number | null;
}

/** 'GetCurrentPostKey' query type */
export interface IGetCurrentPostKeyQuery {
  params: IGetCurrentPostKeyParams;
  result: IGetCurrentPostKeyResult;
}

const getCurrentPostKeyIR: any = {"name":"GetCurrentPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2098,"b":2103,"line":71,"col":46},{"a":2189,"b":2194,"line":74,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId AND valid_end IS NULL\n)","loc":{"a":2052,"b":2218,"line":71,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (
 *     SELECT id
 *     FROM post_key_sets
 *     WHERE owner_id = :userId AND valid_end IS NULL
 * )
 * ```
 */
export const getCurrentPostKey = new PreparedQuery<IGetCurrentPostKeyParams,IGetCurrentPostKeyResult>(getCurrentPostKeyIR);


/** 'GetAllPostKeys' parameters type */
export interface IGetAllPostKeysParams {
  userId: number | null | void;
}

/** 'GetAllPostKeys' return type */
export interface IGetAllPostKeysResult {
  key: string;
  recipientId: number;
  postKeySetId: number;
  id: number;
  followRelationshipId: number | null;
}

/** 'GetAllPostKeys' query type */
export interface IGetAllPostKeysQuery {
  params: IGetAllPostKeysParams;
  result: IGetAllPostKeysResult;
}

const getAllPostKeysIR: any = {"name":"GetAllPostKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2295,"b":2300,"line":78,"col":46},{"a":2386,"b":2391,"line":81,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId\n)","loc":{"a":2249,"b":2393,"line":78,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (
 *     SELECT id
 *     FROM post_key_sets
 *     WHERE owner_id = :userId
 * )
 * ```
 */
export const getAllPostKeys = new PreparedQuery<IGetAllPostKeysParams,IGetAllPostKeysResult>(getAllPostKeysIR);


/** 'CreateCurrentPostKeySet' parameters type */
export interface ICreateCurrentPostKeySetParams {
  ownerId: number | null | void;
  key: string | null | void;
}

/** 'CreateCurrentPostKeySet' return type */
export interface ICreateCurrentPostKeySetResult {
  postKeySetId: number;
}

/** 'CreateCurrentPostKeySet' query type */
export interface ICreateCurrentPostKeySetQuery {
  params: ICreateCurrentPostKeySetParams;
  result: ICreateCurrentPostKeySetResult;
}

const createCurrentPostKeySetIR: any = {"name":"CreateCurrentPostKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2517,"b":2523,"line":87,"col":13},{"a":2613,"b":2619,"line":91,"col":9}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2660,"b":2662,"line":91,"col":56}]}}],"usedParamSet":{"ownerId":true,"key":true},"statement":{"body":"WITH new_post_key_set_id AS (\n    INSERT INTO post_key_sets (owner_id)\n    VALUES (:ownerId)\n    RETURNING id\n)\nINSERT INTO post_keys (recipient_id, post_key_set_id, key)\nVALUES (:ownerId, (SELECT * FROM new_post_key_set_id), :key)\nRETURNING post_key_set_id","loc":{"a":2433,"b":2689,"line":85,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH new_post_key_set_id AS (
 *     INSERT INTO post_key_sets (owner_id)
 *     VALUES (:ownerId)
 *     RETURNING id
 * )
 * INSERT INTO post_keys (recipient_id, post_key_set_id, key)
 * VALUES (:ownerId, (SELECT * FROM new_post_key_set_id), :key)
 * RETURNING post_key_set_id
 * ```
 */
export const createCurrentPostKeySet = new PreparedQuery<ICreateCurrentPostKeySetParams,ICreateCurrentPostKeySetResult>(createCurrentPostKeySetIR);


/** 'AddPostKeys' parameters type */
export interface IAddPostKeysParams {
  keysWithFollowerIds: Array<{
    recipientId: number | null | void,
    postKeySetId: number | null | void,
    key: string | null | void,
    followRelationshipId: number | null | void
  }>;
}

/** 'AddPostKeys' return type */
export type IAddPostKeysResult = void;

/** 'AddPostKeys' query type */
export interface IAddPostKeysQuery {
  params: IAddPostKeysParams;
  result: IAddPostKeysResult;
}

const addPostKeysIR: any = {"name":"AddPostKeys","params":[{"name":"keysWithFollowerIds","codeRefs":{"defined":{"a":2729,"b":2747,"line":96,"col":11},"used":[{"a":2906,"b":2924,"line":99,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","postKeySetId","key","followRelationshipId"]}}],"usedParamSet":{"keysWithFollowerIds":true},"statement":{"body":"INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)\nVALUES :keysWithFollowerIds","loc":{"a":2815,"b":2924,"line":98,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)
 * VALUES :keysWithFollowerIds
 * ```
 */
export const addPostKeys = new PreparedQuery<IAddPostKeysParams,IAddPostKeysResult>(addPostKeysIR);


/** 'GetCurrentProfileKey' parameters type */
export interface IGetCurrentProfileKeyParams {
  userId: number | null | void;
}

/** 'GetCurrentProfileKey' return type */
export interface IGetCurrentProfileKeyResult {
  key: string;
  profileKeyStale: boolean;
}

/** 'GetCurrentProfileKey' query type */
export interface IGetCurrentProfileKeyQuery {
  params: IGetCurrentProfileKeyParams;
  result: IGetCurrentProfileKeyResult;
}

const getCurrentProfileKeyIR: any = {"name":"GetCurrentProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":3114,"b":3119,"line":106,"col":33},{"a":3150,"b":3155,"line":107,"col":29}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT profile_keys.key,\n       users.profile_key_stale\nFROM profile_keys, users\nWHERE profile_keys.owner_id = users.id\nAND profile_keys.recipient_id = :userId\nAND profile_keys.owner_id = :userId","loc":{"a":2961,"b":3155,"line":102,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT profile_keys.key,
 *        users.profile_key_stale
 * FROM profile_keys, users
 * WHERE profile_keys.owner_id = users.id
 * AND profile_keys.recipient_id = :userId
 * AND profile_keys.owner_id = :userId
 * ```
 */
export const getCurrentProfileKey = new PreparedQuery<IGetCurrentProfileKeyParams,IGetCurrentProfileKeyResult>(getCurrentProfileKeyIR);


/** 'CreateProfileKey' parameters type */
export interface ICreateProfileKeyParams {
  keysWithSupportingRelationshipIds: Array<{
    recipientId: number | null | void,
    ownerId: number | null | void,
    key: string | null | void,
    outFollowRequestId: number | null | void,
    outFollowRelationshipId: number | null | void,
    inFollowRelationshipId: number | null | void
  }>;
  userId: number | null | void;
  key: string | null | void;
}

/** 'CreateProfileKey' return type */
export type ICreateProfileKeyResult = void;

/** 'CreateProfileKey' query type */
export interface ICreateProfileKeyQuery {
  params: ICreateProfileKeyParams;
  result: ICreateProfileKeyResult;
}

const createProfileKeyIR: any = {"name":"CreateProfileKey","params":[{"name":"keysWithSupportingRelationshipIds","codeRefs":{"defined":{"a":3200,"b":3232,"line":111,"col":11},"used":[{"a":3686,"b":3718,"line":120,"col":12}]},"transform":{"type":"pick_array_spread","keys":["recipientId","ownerId","key","outFollowRequestId","outFollowRelationshipId","inFollowRelationshipId"]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":3405,"b":3410,"line":114,"col":47},{"a":3499,"b":3504,"line":117,"col":13},{"a":3508,"b":3513,"line":117,"col":22},{"a":3777,"b":3782,"line":122,"col":55}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":3517,"b":3519,"line":117,"col":31}]}}],"usedParamSet":{"userId":true,"key":true,"keysWithSupportingRelationshipIds":true},"statement":{"body":"WITH dummy AS (\n    DELETE FROM profile_keys WHERE owner_id = :userId\n), dummy2 AS (\n    INSERT INTO profile_keys (recipient_id, owner_id, key)\n    VALUES (:userId, :userId, :key)\n), dummy3 AS (\n    INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)\n    VALUES :keysWithSupportingRelationshipIds\n)\nUPDATE users SET profile_key_stale = false WHERE id = :userId","loc":{"a":3342,"b":3782,"line":113,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH dummy AS (
 *     DELETE FROM profile_keys WHERE owner_id = :userId
 * ), dummy2 AS (
 *     INSERT INTO profile_keys (recipient_id, owner_id, key)
 *     VALUES (:userId, :userId, :key)
 * ), dummy3 AS (
 *     INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)
 *     VALUES :keysWithSupportingRelationshipIds
 * )
 * UPDATE users SET profile_key_stale = false WHERE id = :userId
 * ```
 */
export const createProfileKey = new PreparedQuery<ICreateProfileKeyParams,ICreateProfileKeyResult>(createProfileKeyIR);


/** 'AddProfileKey' parameters type */
export interface IAddProfileKeyParams {
  userId: number | null | void;
  recipientId: number | null | void;
  ownerId: number | null | void;
  key: string | null | void;
  outFollowRequestId: number | null | void;
  outFollowRelationshipId: number | null | void;
  inFollowRelationshipId: number | null | void;
}

/** 'AddProfileKey' return type */
export type IAddProfileKeyResult = void;

/** 'AddProfileKey' query type */
export interface IAddProfileKeyQuery {
  params: IAddProfileKeyParams;
  result: IAddProfileKeyResult;
}

const addProfileKeyIR: any = {"name":"AddProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":3875,"b":3880,"line":126,"col":47}]}},{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":3902,"b":3912,"line":126,"col":74},{"a":4058,"b":4068,"line":129,"col":9}]}},{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":4072,"b":4078,"line":129,"col":23}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":4082,"b":4084,"line":129,"col":33}]}},{"name":"outFollowRequestId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":4088,"b":4105,"line":129,"col":39}]}},{"name":"outFollowRelationshipId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":4109,"b":4131,"line":129,"col":60}]}},{"name":"inFollowRelationshipId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":4135,"b":4156,"line":129,"col":86}]}}],"usedParamSet":{"userId":true,"recipientId":true,"ownerId":true,"key":true,"outFollowRequestId":true,"outFollowRelationshipId":true,"inFollowRelationshipId":true},"statement":{"body":"WITH dummy AS (\n    DELETE FROM profile_keys WHERE owner_id = :userId AND recipient_id = :recipientId\n)\nINSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)\nVALUES (:recipientId, :ownerId, :key, :outFollowRequestId, :outFollowRelationshipId, :inFollowRelationshipId)","loc":{"a":3812,"b":4157,"line":125,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH dummy AS (
 *     DELETE FROM profile_keys WHERE owner_id = :userId AND recipient_id = :recipientId
 * )
 * INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)
 * VALUES (:recipientId, :ownerId, :key, :outFollowRequestId, :outFollowRelationshipId, :inFollowRelationshipId)
 * ```
 */
export const addProfileKey = new PreparedQuery<IAddProfileKeyParams,IAddProfileKeyResult>(addProfileKeyIR);


