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

const getPublicKeyIR: any = {"name":"GetPublicKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":240,"b":245,"line":9,"col":45}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id = :userId","loc":{"a":195,"b":245,"line":9,"col":0}}};

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

const getPostKeyIR: any = {"name":"GetPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":318,"b":323,"line":12,"col":46}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":348,"b":355,"line":12,"col":76}]}}],"usedParamSet":{"userId":true,"keySetId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId","loc":{"a":272,"b":355,"line":12,"col":0}}};

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

const getCurrentPostKeyIR: any = {"name":"GetCurrentPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":435,"b":440,"line":15,"col":46},{"a":526,"b":531,"line":18,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId AND valid_end IS NULL\n)","loc":{"a":389,"b":555,"line":15,"col":0}}};

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

const getAllPostKeysIR: any = {"name":"GetAllPostKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":632,"b":637,"line":22,"col":46},{"a":723,"b":728,"line":25,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId\n)","loc":{"a":586,"b":730,"line":22,"col":0}}};

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


/** 'EndCurrentPostKeySetValidity' parameters type */
export interface IEndCurrentPostKeySetValidityParams {
  userId: number | null | void;
}

/** 'EndCurrentPostKeySetValidity' return type */
export type IEndCurrentPostKeySetValidityResult = void;

/** 'EndCurrentPostKeySetValidity' query type */
export interface IEndCurrentPostKeySetValidityQuery {
  params: IEndCurrentPostKeySetValidityParams;
  result: IEndCurrentPostKeySetValidityResult;
}

const endCurrentPostKeySetValidityIR: any = {"name":"EndCurrentPostKeySetValidity","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":836,"b":841,"line":31,"col":18}]}}],"usedParamSet":{"userId":true},"statement":{"body":"UPDATE post_key_sets\nSET valid_end = now()\nWHERE owner_id = :userId AND valid_end IS NULL","loc":{"a":775,"b":863,"line":29,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE post_key_sets
 * SET valid_end = now()
 * WHERE owner_id = :userId AND valid_end IS NULL
 * ```
 */
export const endCurrentPostKeySetValidity = new PreparedQuery<IEndCurrentPostKeySetValidityParams,IEndCurrentPostKeySetValidityResult>(endCurrentPostKeySetValidityIR);


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

const createCurrentPostKeySetIR: any = {"name":"CreateCurrentPostKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":987,"b":993,"line":36,"col":13},{"a":1083,"b":1089,"line":40,"col":9}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1130,"b":1132,"line":40,"col":56}]}}],"usedParamSet":{"ownerId":true,"key":true},"statement":{"body":"WITH new_post_key_set_id AS (\n    INSERT INTO post_key_sets (owner_id)\n    VALUES (:ownerId)\n    RETURNING id\n)\nINSERT INTO post_keys (recipient_id, post_key_set_id, key)\nVALUES (:ownerId, (SELECT * FROM new_post_key_set_id), :key)\nRETURNING post_key_set_id","loc":{"a":903,"b":1159,"line":34,"col":0}}};

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

const addPostKeysIR: any = {"name":"AddPostKeys","params":[{"name":"keysWithFollowerIds","codeRefs":{"defined":{"a":1199,"b":1217,"line":45,"col":11},"used":[{"a":1376,"b":1394,"line":48,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","postKeySetId","key","followRelationshipId"]}}],"usedParamSet":{"keysWithFollowerIds":true},"statement":{"body":"INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)\nVALUES :keysWithFollowerIds","loc":{"a":1285,"b":1394,"line":47,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)
 * VALUES :keysWithFollowerIds
 * ```
 */
export const addPostKeys = new PreparedQuery<IAddPostKeysParams,IAddPostKeysResult>(addPostKeysIR);


/** 'GetProfileKey' parameters type */
export interface IGetProfileKeyParams {
  recipientId: number | null | void;
  ownerId: number | null | void;
}

/** 'GetProfileKey' return type */
export interface IGetProfileKeyResult {
  id: number;
  recipientId: number;
  ownerId: number;
  key: string;
  outFollowRequestId: number | null;
  outFollowRelationshipId: number | null;
  inFollowRelationshipId: number | null;
}

/** 'GetProfileKey' query type */
export interface IGetProfileKeyQuery {
  params: IGetProfileKeyParams;
  result: IGetProfileKeyResult;
}

const getProfileKeyIR: any = {"name":"GetProfileKey","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1473,"b":1483,"line":51,"col":49}]}},{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1501,"b":1507,"line":51,"col":77}]}}],"usedParamSet":{"recipientId":true,"ownerId":true},"statement":{"body":"SELECT * FROM profile_keys WHERE recipient_id = :recipientId AND owner_id = :ownerId","loc":{"a":1424,"b":1507,"line":51,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM profile_keys WHERE recipient_id = :recipientId AND owner_id = :ownerId
 * ```
 */
export const getProfileKey = new PreparedQuery<IGetProfileKeyParams,IGetProfileKeyResult>(getProfileKeyIR);


/** 'GetCurrentProfileKey' parameters type */
export interface IGetCurrentProfileKeyParams {
  userId: number | null | void;
}

/** 'GetCurrentProfileKey' return type */
export interface IGetCurrentProfileKeyResult {
  key: string;
}

/** 'GetCurrentProfileKey' query type */
export interface IGetCurrentProfileKeyQuery {
  params: IGetCurrentProfileKeyParams;
  result: IGetCurrentProfileKeyResult;
}

const getCurrentProfileKeyIR: any = {"name":"GetCurrentProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1665,"b":1670,"line":57,"col":33},{"a":1701,"b":1706,"line":58,"col":29}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT profile_keys.key\nFROM profile_keys, users\nWHERE profile_keys.owner_id = users.id\nAND profile_keys.recipient_id = :userId\nAND profile_keys.owner_id = :userId\nAND users.profile_key_stale = false","loc":{"a":1544,"b":1742,"line":54,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT profile_keys.key
 * FROM profile_keys, users
 * WHERE profile_keys.owner_id = users.id
 * AND profile_keys.recipient_id = :userId
 * AND profile_keys.owner_id = :userId
 * AND users.profile_key_stale = false
 * ```
 */
export const getCurrentProfileKey = new PreparedQuery<IGetCurrentProfileKeyParams,IGetCurrentProfileKeyResult>(getCurrentProfileKeyIR);


/** 'MarkProfileKeyStale' parameters type */
export interface IMarkProfileKeyStaleParams {
  userId: number | null | void;
}

/** 'MarkProfileKeyStale' return type */
export type IMarkProfileKeyStaleResult = void;

/** 'MarkProfileKeyStale' query type */
export interface IMarkProfileKeyStaleQuery {
  params: IMarkProfileKeyStaleParams;
  result: IMarkProfileKeyStaleResult;
}

const markProfileKeyStaleIR: any = {"name":"MarkProfileKeyStale","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1832,"b":1837,"line":62,"col":54}]}}],"usedParamSet":{"userId":true},"statement":{"body":"UPDATE users SET profile_key_stale = true WHERE id = :userId","loc":{"a":1778,"b":1837,"line":62,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users SET profile_key_stale = true WHERE id = :userId
 * ```
 */
export const markProfileKeyStale = new PreparedQuery<IMarkProfileKeyStaleParams,IMarkProfileKeyStaleResult>(markProfileKeyStaleIR);


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

const createProfileKeyIR: any = {"name":"CreateProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1933,"b":1938,"line":66,"col":47},{"a":2014,"b":2019,"line":68,"col":59},{"a":2087,"b":2092,"line":71,"col":9},{"a":2096,"b":2101,"line":71,"col":18}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2105,"b":2107,"line":71,"col":27}]}}],"usedParamSet":{"userId":true,"key":true},"statement":{"body":"WITH dummy AS (\n    DELETE FROM profile_keys WHERE owner_id = :userId\n), dummy2 AS (\n    UPDATE users SET profile_key_stale = false WHERE id = :userId\n)\nINSERT INTO profile_keys (recipient_id, owner_id, key)\nVALUES (:userId, :userId, :key)","loc":{"a":1870,"b":2108,"line":65,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH dummy AS (
 *     DELETE FROM profile_keys WHERE owner_id = :userId
 * ), dummy2 AS (
 *     UPDATE users SET profile_key_stale = false WHERE id = :userId
 * )
 * INSERT INTO profile_keys (recipient_id, owner_id, key)
 * VALUES (:userId, :userId, :key)
 * ```
 */
export const createProfileKey = new PreparedQuery<ICreateProfileKeyParams,ICreateProfileKeyResult>(createProfileKeyIR);


/** 'AddProfileKeys' parameters type */
export interface IAddProfileKeysParams {
  keysWithSupportingRelationshipIds: Array<{
    recipientId: number | null | void,
    ownerId: number | null | void,
    key: string | null | void,
    outFollowRequestId: number | null | void,
    outFollowRelationshipId: number | null | void,
    inFollowRelationshipId: number | null | void
  }>;
}

/** 'AddProfileKeys' return type */
export type IAddProfileKeysResult = void;

/** 'AddProfileKeys' query type */
export interface IAddProfileKeysQuery {
  params: IAddProfileKeysParams;
  result: IAddProfileKeysResult;
}

const addProfileKeysIR: any = {"name":"AddProfileKeys","params":[{"name":"keysWithSupportingRelationshipIds","codeRefs":{"defined":{"a":2151,"b":2183,"line":75,"col":11},"used":[{"a":2434,"b":2466,"line":78,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","ownerId","key","outFollowRequestId","outFollowRelationshipId","inFollowRelationshipId"]}}],"usedParamSet":{"keysWithSupportingRelationshipIds":true},"statement":{"body":"INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)\nVALUES :keysWithSupportingRelationshipIds","loc":{"a":2293,"b":2466,"line":77,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)
 * VALUES :keysWithSupportingRelationshipIds
 * ```
 */
export const addProfileKeys = new PreparedQuery<IAddProfileKeysParams,IAddProfileKeysResult>(addProfileKeysIR);


