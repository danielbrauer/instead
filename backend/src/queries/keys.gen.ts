/** Types generated for queries found in "src/queries/keys.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetCurrentPostKey' parameters type */
export interface IGetCurrentPostKeyParams {
  userId: number | null | void;
}

/** 'GetCurrentPostKey' return type */
export interface IGetCurrentPostKeyResult {
  key: string;
  userId: number;
  keySetId: number;
  id: number;
  followRequestId: number | null;
  followRelationshipId: number | null;
}

/** 'GetCurrentPostKey' query type */
export interface IGetCurrentPostKeyQuery {
  params: IGetCurrentPostKeyParams;
  result: IGetCurrentPostKeyResult;
}

const getCurrentPostKeyIR: any = {"name":"GetCurrentPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":66,"b":71,"line":2,"col":36},{"a":159,"b":164,"line":5,"col":16}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (\n    SELECT current_post_key_set_id\n    FROM users\n    WHERE id = :userId\n)","loc":{"a":30,"b":166,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
 *     SELECT current_post_key_set_id
 *     FROM users
 *     WHERE id = :userId
 * )
 * ```
 */
export const getCurrentPostKey = new PreparedQuery<IGetCurrentPostKeyParams,IGetCurrentPostKeyResult>(getCurrentPostKeyIR);


/** 'GetKey' parameters type */
export interface IGetKeyParams {
  userId: number | null | void;
  keySetId: number | null | void;
}

/** 'GetKey' return type */
export interface IGetKeyResult {
  key: string;
  userId: number;
  keySetId: number;
  id: number;
  followRequestId: number | null;
  followRelationshipId: number | null;
}

/** 'GetKey' query type */
export interface IGetKeyQuery {
  params: IGetKeyParams;
  result: IGetKeyResult;
}

const getKeyIR: any = {"name":"GetKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":225,"b":230,"line":9,"col":36}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":250,"b":257,"line":9,"col":61}]}}],"usedParamSet":{"userId":true,"keySetId":true},"statement":{"body":"SELECT * FROM keys WHERE user_id = :userId AND key_set_id = :keySetId","loc":{"a":189,"b":257,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM keys WHERE user_id = :userId AND key_set_id = :keySetId
 * ```
 */
export const getKey = new PreparedQuery<IGetKeyParams,IGetKeyResult>(getKeyIR);


/** 'GetAllPostKeys' parameters type */
export interface IGetAllPostKeysParams {
  userId: number | null | void;
}

/** 'GetAllPostKeys' return type */
export interface IGetAllPostKeysResult {
  key: string;
  userId: number;
  keySetId: number;
  id: number;
  followRequestId: number | null;
  followRelationshipId: number | null;
}

/** 'GetAllPostKeys' query type */
export interface IGetAllPostKeysQuery {
  params: IGetAllPostKeysParams;
  result: IGetAllPostKeysResult;
}

const getAllPostKeysIR: any = {"name":"GetAllPostKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":324,"b":329,"line":12,"col":36},{"a":405,"b":410,"line":15,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (\n    SELECT id\n    FROM key_sets\n    WHERE owner_id = :userId\n)","loc":{"a":288,"b":412,"line":12,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
 *     SELECT id
 *     FROM key_sets
 *     WHERE owner_id = :userId
 * )
 * ```
 */
export const getAllPostKeys = new PreparedQuery<IGetAllPostKeysParams,IGetAllPostKeysResult>(getAllPostKeysIR);


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

const getFollowerPublicKeysIR: any = {"name":"GetFollowerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":575,"b":580,"line":22,"col":25}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id IN (\n    SELECT follower_id\n    FROM follow_relationships\n    WHERE followee_id = :userId\n)","loc":{"a":450,"b":582,"line":19,"col":0}}};

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

const getPublicKeyIR: any = {"name":"GetPublicKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":656,"b":661,"line":26,"col":45}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id = :userId","loc":{"a":611,"b":661,"line":26,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, public_key FROM users WHERE id = :userId
 * ```
 */
export const getPublicKey = new PreparedQuery<IGetPublicKeyParams,IGetPublicKeyResult>(getPublicKeyIR);


/** 'EndPostKeySetValidity' parameters type */
export interface IEndPostKeySetValidityParams {
  userId: number | null | void;
}

/** 'EndPostKeySetValidity' return type */
export type IEndPostKeySetValidityResult = void;

/** 'EndPostKeySetValidity' query type */
export interface IEndPostKeySetValidityQuery {
  params: IEndPostKeySetValidityParams;
  result: IEndPostKeySetValidityResult;
}

const endPostKeySetValidityIR: any = {"name":"EndPostKeySetValidity","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":788,"b":793,"line":32,"col":16},{"a":881,"b":886,"line":36,"col":16}]}}],"usedParamSet":{"userId":true},"statement":{"body":"WITH old_post_key AS (\n    SELECT current_post_key_set_id\n    FROM users\n    WHERE id = :userId\n), dummy AS (\n    UPDATE users\n    SET current_post_key_set_id = NULL\n    where id = :userId\n)\nUPDATE key_sets SET valid_end = now() WHERE id = (SELECT * FROM old_post_key)","loc":{"a":699,"b":966,"line":29,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH old_post_key AS (
 *     SELECT current_post_key_set_id
 *     FROM users
 *     WHERE id = :userId
 * ), dummy AS (
 *     UPDATE users
 *     SET current_post_key_set_id = NULL
 *     where id = :userId
 * )
 * UPDATE key_sets SET valid_end = now() WHERE id = (SELECT * FROM old_post_key)
 * ```
 */
export const endPostKeySetValidity = new PreparedQuery<IEndPostKeySetValidityParams,IEndPostKeySetValidityResult>(endPostKeySetValidityIR);


/** 'CreateCurrentPostKeySet' parameters type */
export interface ICreateCurrentPostKeySetParams {
  ownerId: number | null | void;
  key: string | null | void;
}

/** 'CreateCurrentPostKeySet' return type */
export interface ICreateCurrentPostKeySetResult {
  keySetId: number;
}

/** 'CreateCurrentPostKeySet' query type */
export interface ICreateCurrentPostKeySetQuery {
  params: ICreateCurrentPostKeySetParams;
  result: ICreateCurrentPostKeySetResult;
}

const createCurrentPostKeySetIR: any = {"name":"CreateCurrentPostKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1080,"b":1086,"line":43,"col":13},{"a":1218,"b":1224,"line":48,"col":16},{"a":1281,"b":1287,"line":51,"col":9}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1323,"b":1325,"line":51,"col":51}]}}],"usedParamSet":{"ownerId":true,"key":true},"statement":{"body":"WITH new_key_set_id AS (\n    INSERT INTO key_sets (owner_id)\n    VALUES (:ownerId)\n    RETURNING id\n), dummy AS (\n    UPDATE users\n    SET current_post_key_set_id = (SELECT * FROM new_key_set_id)\n    WHERE id = :ownerId\n)\nINSERT INTO keys (user_id, key_set_id, key)\nVALUES (:ownerId, (SELECT * FROM new_key_set_id), :key)\nRETURNING key_set_id","loc":{"a":1006,"b":1347,"line":41,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH new_key_set_id AS (
 *     INSERT INTO key_sets (owner_id)
 *     VALUES (:ownerId)
 *     RETURNING id
 * ), dummy AS (
 *     UPDATE users
 *     SET current_post_key_set_id = (SELECT * FROM new_key_set_id)
 *     WHERE id = :ownerId
 * )
 * INSERT INTO keys (user_id, key_set_id, key)
 * VALUES (:ownerId, (SELECT * FROM new_key_set_id), :key)
 * RETURNING key_set_id
 * ```
 */
export const createCurrentPostKeySet = new PreparedQuery<ICreateCurrentPostKeySetParams,ICreateCurrentPostKeySetResult>(createCurrentPostKeySetIR);


/** 'AddPostKeys' parameters type */
export interface IAddPostKeysParams {
  keysWithFollowerIds: Array<{
    userId: number | null | void,
    keySetId: number | null | void,
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

const addPostKeysIR: any = {"name":"AddPostKeys","params":[{"name":"keysWithFollowerIds","codeRefs":{"defined":{"a":1387,"b":1405,"line":56,"col":11},"used":[{"a":1540,"b":1558,"line":59,"col":8}]},"transform":{"type":"pick_array_spread","keys":["userId","keySetId","key","followRelationshipId"]}}],"usedParamSet":{"keysWithFollowerIds":true},"statement":{"body":"INSERT INTO keys (user_id, key_set_id, key, follow_relationship_id)\nVALUES :keysWithFollowerIds","loc":{"a":1464,"b":1558,"line":58,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO keys (user_id, key_set_id, key, follow_relationship_id)
 * VALUES :keysWithFollowerIds
 * ```
 */
export const addPostKeys = new PreparedQuery<IAddPostKeysParams,IAddPostKeysResult>(addPostKeysIR);


