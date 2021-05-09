/** Types generated for queries found in "src/queries/keys.sql" */
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
  id: number;
  publicKey: Json;
}

/** 'GetProfileViewerPublicKeys' query type */
export interface IGetProfileViewerPublicKeysQuery {
  params: IGetProfileViewerPublicKeysParams;
  result: IGetProfileViewerPublicKeysResult;
}

const getProfileViewerPublicKeysIR: any = {"name":"GetProfileViewerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":352,"b":357,"line":14,"col":25},{"a":456,"b":461,"line":19,"col":25},{"a":557,"b":562,"line":24,"col":26}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT users.id, users.public_key\nFROM users\nWHERE users.id IN (\n    SELECT follower_id\n    FROM follow_relationships\n    WHERE followee_id = :userId\n)\nOR users.id IN (\n    SELECT followee_id\n    FROM follow_relationships\n    WHERE follower_id = :userId\n)\nOR users.id IN (\n    SELECT requestee_id\n    FROM follow_requests\n    WHERE requester_id = :userId\n)","loc":{"a":209,"b":564,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT users.id, users.public_key
 * FROM users
 * WHERE users.id IN (
 *     SELECT follower_id
 *     FROM follow_relationships
 *     WHERE followee_id = :userId
 * )
 * OR users.id IN (
 *     SELECT followee_id
 *     FROM follow_relationships
 *     WHERE follower_id = :userId
 * )
 * OR users.id IN (
 *     SELECT requestee_id
 *     FROM follow_requests
 *     WHERE requester_id = :userId
 * )
 * ```
 */
export const getProfileViewerPublicKeys = new PreparedQuery<IGetProfileViewerPublicKeysParams,IGetProfileViewerPublicKeysResult>(getProfileViewerPublicKeysIR);


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

const getPublicKeyIR: any = {"name":"GetPublicKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":638,"b":643,"line":28,"col":45}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id = :userId","loc":{"a":593,"b":643,"line":28,"col":0}}};

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

const getPostKeyIR: any = {"name":"GetPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":716,"b":721,"line":31,"col":46}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":746,"b":753,"line":31,"col":76}]}}],"usedParamSet":{"userId":true,"keySetId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId","loc":{"a":670,"b":753,"line":31,"col":0}}};

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

const getCurrentPostKeyIR: any = {"name":"GetCurrentPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":833,"b":838,"line":34,"col":46},{"a":924,"b":929,"line":37,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId AND valid_end IS NULL\n)","loc":{"a":787,"b":953,"line":34,"col":0}}};

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

const getAllPostKeysIR: any = {"name":"GetAllPostKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1030,"b":1035,"line":41,"col":46},{"a":1121,"b":1126,"line":44,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId\n)","loc":{"a":984,"b":1128,"line":41,"col":0}}};

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

const createCurrentPostKeySetIR: any = {"name":"CreateCurrentPostKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1252,"b":1258,"line":50,"col":13},{"a":1348,"b":1354,"line":54,"col":9}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1395,"b":1397,"line":54,"col":56}]}}],"usedParamSet":{"ownerId":true,"key":true},"statement":{"body":"WITH new_post_key_set_id AS (\n    INSERT INTO post_key_sets (owner_id)\n    VALUES (:ownerId)\n    RETURNING id\n)\nINSERT INTO post_keys (recipient_id, post_key_set_id, key)\nVALUES (:ownerId, (SELECT * FROM new_post_key_set_id), :key)\nRETURNING post_key_set_id","loc":{"a":1168,"b":1424,"line":48,"col":0}}};

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
  keys: readonly ({
    recipientId: number | null | void,
    postKeySetId: number | null | void,
    key: string | null | void
  })[];
}

/** 'AddPostKeys' return type */
export type IAddPostKeysResult = void;

/** 'AddPostKeys' query type */
export interface IAddPostKeysQuery {
  params: IAddPostKeysParams;
  result: IAddPostKeysResult;
}

const addPostKeysIR: any = {"name":"AddPostKeys","params":[{"name":"keys","codeRefs":{"defined":{"a":1464,"b":1467,"line":59,"col":11},"used":[{"a":1580,"b":1583,"line":62,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","postKeySetId","key"]}}],"usedParamSet":{"keys":true},"statement":{"body":"INSERT INTO post_keys (recipient_id, post_key_set_id, key)\nVALUES :keys","loc":{"a":1513,"b":1583,"line":61,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO post_keys (recipient_id, post_key_set_id, key)
 * VALUES :keys
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

const getCurrentProfileKeyIR: any = {"name":"GetCurrentProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1773,"b":1778,"line":69,"col":33},{"a":1809,"b":1814,"line":70,"col":29}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT profile_keys.key,\n       users.profile_key_stale\nFROM profile_keys, users\nWHERE profile_keys.owner_id = users.id\nAND profile_keys.recipient_id = :userId\nAND profile_keys.owner_id = :userId","loc":{"a":1620,"b":1814,"line":65,"col":0}}};

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

const createProfileKeyIR: any = {"name":"CreateProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1910,"b":1915,"line":74,"col":47},{"a":2004,"b":2009,"line":77,"col":13},{"a":2013,"b":2018,"line":77,"col":22},{"a":2084,"b":2089,"line":79,"col":55}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2022,"b":2024,"line":77,"col":31}]}}],"usedParamSet":{"userId":true,"key":true},"statement":{"body":"WITH dummy AS (\n    DELETE FROM profile_keys WHERE owner_id = :userId\n), dummy2 AS (\n    INSERT INTO profile_keys (recipient_id, owner_id, key)\n    VALUES (:userId, :userId, :key)\n)\nUPDATE users SET profile_key_stale = false WHERE id = :userId","loc":{"a":1847,"b":2089,"line":73,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH dummy AS (
 *     DELETE FROM profile_keys WHERE owner_id = :userId
 * ), dummy2 AS (
 *     INSERT INTO profile_keys (recipient_id, owner_id, key)
 *     VALUES (:userId, :userId, :key)
 * )
 * UPDATE users SET profile_key_stale = false WHERE id = :userId
 * ```
 */
export const createProfileKey = new PreparedQuery<ICreateProfileKeyParams,ICreateProfileKeyResult>(createProfileKeyIR);


/** 'AddProfileKeys' parameters type */
export interface IAddProfileKeysParams {
  viewerKeys: readonly ({
    recipientId: number | null | void,
    ownerId: number | null | void,
    key: string | null | void
  })[];
}

/** 'AddProfileKeys' return type */
export type IAddProfileKeysResult = void;

/** 'AddProfileKeys' query type */
export interface IAddProfileKeysQuery {
  params: IAddProfileKeysParams;
  result: IAddProfileKeysResult;
}

const addProfileKeysIR: any = {"name":"AddProfileKeys","params":[{"name":"viewerKeys","codeRefs":{"defined":{"a":2132,"b":2141,"line":83,"col":11},"used":[{"a":2245,"b":2254,"line":86,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","ownerId","key"]}}],"usedParamSet":{"viewerKeys":true},"statement":{"body":"INSERT INTO profile_keys (recipient_id, owner_id, key)\nVALUES :viewerKeys","loc":{"a":2182,"b":2254,"line":85,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO profile_keys (recipient_id, owner_id, key)
 * VALUES :viewerKeys
 * ```
 */
export const addProfileKeys = new PreparedQuery<IAddProfileKeysParams,IAddProfileKeysResult>(addProfileKeysIR);


/** 'AddOrReplaceProfileKey' parameters type */
export interface IAddOrReplaceProfileKeyParams {
  ownerId: number | null | void;
  recipientId: number | null | void;
  key: string | null | void;
}

/** 'AddOrReplaceProfileKey' return type */
export type IAddOrReplaceProfileKeyResult = void;

/** 'AddOrReplaceProfileKey' query type */
export interface IAddOrReplaceProfileKeyQuery {
  params: IAddOrReplaceProfileKeyParams;
  result: IAddOrReplaceProfileKeyResult;
}

const addOrReplaceProfileKeyIR: any = {"name":"AddOrReplaceProfileKey","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2356,"b":2362,"line":90,"col":47},{"a":2476,"b":2482,"line":93,"col":23}]}},{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2384,"b":2394,"line":90,"col":75},{"a":2462,"b":2472,"line":93,"col":9}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2486,"b":2488,"line":93,"col":33}]}}],"usedParamSet":{"ownerId":true,"recipientId":true,"key":true},"statement":{"body":"WITH dummy AS (\n    DELETE FROM profile_keys WHERE owner_id = :ownerId AND recipient_id = :recipientId\n)\nINSERT INTO profile_keys (recipient_id, owner_id, key)\nVALUES (:recipientId, :ownerId, :key)","loc":{"a":2293,"b":2489,"line":89,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH dummy AS (
 *     DELETE FROM profile_keys WHERE owner_id = :ownerId AND recipient_id = :recipientId
 * )
 * INSERT INTO profile_keys (recipient_id, owner_id, key)
 * VALUES (:recipientId, :ownerId, :key)
 * ```
 */
export const addOrReplaceProfileKey = new PreparedQuery<IAddOrReplaceProfileKeyParams,IAddOrReplaceProfileKeyResult>(addOrReplaceProfileKeyIR);


