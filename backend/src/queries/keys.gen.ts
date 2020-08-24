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

const createCurrentPostKeySetIR: any = {"name":"CreateCurrentPostKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":854,"b":860,"line":31,"col":13},{"a":950,"b":956,"line":35,"col":9}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":997,"b":999,"line":35,"col":56}]}}],"usedParamSet":{"ownerId":true,"key":true},"statement":{"body":"WITH new_post_key_set_id AS (\n    INSERT INTO post_key_sets (owner_id)\n    VALUES (:ownerId)\n    RETURNING id\n)\nINSERT INTO post_keys (recipient_id, post_key_set_id, key)\nVALUES (:ownerId, (SELECT * FROM new_post_key_set_id), :key)\nRETURNING post_key_set_id","loc":{"a":770,"b":1026,"line":29,"col":0}}};

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

const addPostKeysIR: any = {"name":"AddPostKeys","params":[{"name":"keysWithFollowerIds","codeRefs":{"defined":{"a":1066,"b":1084,"line":40,"col":11},"used":[{"a":1243,"b":1261,"line":43,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","postKeySetId","key","followRelationshipId"]}}],"usedParamSet":{"keysWithFollowerIds":true},"statement":{"body":"INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)\nVALUES :keysWithFollowerIds","loc":{"a":1152,"b":1261,"line":42,"col":0}}};

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

const getProfileKeyIR: any = {"name":"GetProfileKey","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1340,"b":1350,"line":46,"col":49}]}},{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1368,"b":1374,"line":46,"col":77}]}}],"usedParamSet":{"recipientId":true,"ownerId":true},"statement":{"body":"SELECT * FROM profile_keys WHERE recipient_id = :recipientId AND owner_id = :ownerId","loc":{"a":1291,"b":1374,"line":46,"col":0}}};

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

const getCurrentProfileKeyIR: any = {"name":"GetCurrentProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1532,"b":1537,"line":52,"col":33},{"a":1568,"b":1573,"line":53,"col":29}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT profile_keys.key\nFROM profile_keys, users\nWHERE profile_keys.owner_id = users.id\nAND profile_keys.recipient_id = :userId\nAND profile_keys.owner_id = :userId\nAND users.profile_key_stale = false","loc":{"a":1411,"b":1609,"line":49,"col":0}}};

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

const createProfileKeyIR: any = {"name":"CreateProfileKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1705,"b":1710,"line":58,"col":47},{"a":1786,"b":1791,"line":60,"col":59},{"a":1859,"b":1864,"line":63,"col":9},{"a":1868,"b":1873,"line":63,"col":18}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1877,"b":1879,"line":63,"col":27}]}}],"usedParamSet":{"userId":true,"key":true},"statement":{"body":"WITH dummy AS (\n    DELETE FROM profile_keys WHERE owner_id = :userId\n), dummy2 AS (\n    UPDATE users SET profile_key_stale = false WHERE id = :userId\n)\nINSERT INTO profile_keys (recipient_id, owner_id, key)\nVALUES (:userId, :userId, :key)","loc":{"a":1642,"b":1880,"line":57,"col":0}}};

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

const addProfileKeysIR: any = {"name":"AddProfileKeys","params":[{"name":"keysWithSupportingRelationshipIds","codeRefs":{"defined":{"a":1923,"b":1955,"line":67,"col":11},"used":[{"a":2206,"b":2238,"line":70,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","ownerId","key","outFollowRequestId","outFollowRelationshipId","inFollowRelationshipId"]}}],"usedParamSet":{"keysWithSupportingRelationshipIds":true},"statement":{"body":"INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)\nVALUES :keysWithSupportingRelationshipIds","loc":{"a":2065,"b":2238,"line":69,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO profile_keys (recipient_id, owner_id, key, out_follow_request_id, out_follow_relationship_id, in_follow_relationship_id)
 * VALUES :keysWithSupportingRelationshipIds
 * ```
 */
export const addProfileKeys = new PreparedQuery<IAddProfileKeysParams,IAddProfileKeysResult>(addProfileKeysIR);


