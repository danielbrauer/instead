/** Types generated for queries found in "src/queries/keys.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetCurrentKey' parameters type */
export interface IGetCurrentKeyParams {
  userId: number | null | void;
}

/** 'GetCurrentKey' return type */
export interface IGetCurrentKeyResult {
  key: string;
  userId: number;
  keySetId: number;
}

/** 'GetCurrentKey' query type */
export interface IGetCurrentKeyQuery {
  params: IGetCurrentKeyParams;
  result: IGetCurrentKeyResult;
}

const getCurrentKeyIR: any = {"name":"GetCurrentKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":62,"b":67,"line":2,"col":36},{"a":143,"b":148,"line":5,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (\n    SELECT id\n    FROM key_sets\n    WHERE owner_id = :userId AND valid_end IS NULL\n)","loc":{"a":26,"b":172,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
 *     SELECT id
 *     FROM key_sets
 *     WHERE owner_id = :userId AND valid_end IS NULL
 * )
 * ```
 */
export const getCurrentKey = new PreparedQuery<IGetCurrentKeyParams,IGetCurrentKeyResult>(getCurrentKeyIR);


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

const getFollowerPublicKeysIR: any = {"name":"GetFollowerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":324,"b":329,"line":12,"col":25}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id IN (\n    SELECT follower_id\n    FROM followers\n    WHERE followee_id = :userId\n)","loc":{"a":210,"b":331,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, public_key FROM users WHERE id IN (
 *     SELECT follower_id
 *     FROM followers
 *     WHERE followee_id = :userId
 * )
 * ```
 */
export const getFollowerPublicKeys = new PreparedQuery<IGetFollowerPublicKeysParams,IGetFollowerPublicKeysResult>(getFollowerPublicKeysIR);


/** 'EndKeySetValidity' parameters type */
export interface IEndKeySetValidityParams {
  keySetId: number | null | void;
}

/** 'EndKeySetValidity' return type */
export type IEndKeySetValidityResult = void;

/** 'EndKeySetValidity' query type */
export interface IEndKeySetValidityQuery {
  params: IEndKeySetValidityParams;
  result: IEndKeySetValidityResult;
}

const endKeySetValidityIR: any = {"name":"EndKeySetValidity","params":[{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":415,"b":422,"line":16,"col":50}]}}],"usedParamSet":{"keySetId":true},"statement":{"body":"UPDATE key_sets SET valid_end = now() WHERE id = :keySetId","loc":{"a":365,"b":422,"line":16,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE key_sets SET valid_end = now() WHERE id = :keySetId
 * ```
 */
export const endKeySetValidity = new PreparedQuery<IEndKeySetValidityParams,IEndKeySetValidityResult>(endKeySetValidityIR);


/** 'CreateKeySet' parameters type */
export interface ICreateKeySetParams {
  ownerId: number | null | void;
}

/** 'CreateKeySet' return type */
export interface ICreateKeySetResult {
  id: number;
}

/** 'CreateKeySet' query type */
export interface ICreateKeySetQuery {
  params: ICreateKeySetParams;
  result: ICreateKeySetResult;
}

const createKeySetIR: any = {"name":"CreateKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":492,"b":498,"line":19,"col":41}]}}],"usedParamSet":{"ownerId":true},"statement":{"body":"INSERT INTO key_sets (owner_id) VALUES (:ownerId) RETURNING id","loc":{"a":451,"b":512,"line":19,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO key_sets (owner_id) VALUES (:ownerId) RETURNING id
 * ```
 */
export const createKeySet = new PreparedQuery<ICreateKeySetParams,ICreateKeySetResult>(createKeySetIR);


/** 'AddKeys' parameters type */
export interface IAddKeysParams {
  keys: Array<{
    userId: number | null | void,
    keySetId: number | null | void,
    key: string | null | void
  }>;
}

/** 'AddKeys' return type */
export type IAddKeysResult = void;

/** 'AddKeys' query type */
export interface IAddKeysQuery {
  params: IAddKeysParams;
  result: IAddKeysResult;
}

const addKeysIR: any = {"name":"AddKeys","params":[{"name":"keys","codeRefs":{"defined":{"a":548,"b":551,"line":23,"col":11},"used":[{"a":640,"b":643,"line":26,"col":8}]},"transform":{"type":"pick_array_spread","keys":["userId","keySetId","key"]}}],"usedParamSet":{"keys":true},"statement":{"body":"INSERT INTO keys (user_id, key_set_id, key)\nVALUES :keys","loc":{"a":588,"b":643,"line":25,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO keys (user_id, key_set_id, key)
 * VALUES :keys
 * ```
 */
export const addKeys = new PreparedQuery<IAddKeysParams,IAddKeysResult>(addKeysIR);


/** 'RemoveFollowerKeys' parameters type */
export interface IRemoveFollowerKeysParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'RemoveFollowerKeys' return type */
export type IRemoveFollowerKeysResult = void;

/** 'RemoveFollowerKeys' query type */
export interface IRemoveFollowerKeysQuery {
  params: IRemoveFollowerKeysParams;
  result: IRemoveFollowerKeysResult;
}

const removeFollowerKeysIR: any = {"name":"RemoveFollowerKeys","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":712,"b":721,"line":29,"col":34}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":805,"b":814,"line":32,"col":22}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"DELETE FROM keys WHERE user_id = :followerId AND key_set_id IN (\n    SELECT key_set_id\n    FROM key_sets\n    WHERE owner_id = :followeeId\n)","loc":{"a":678,"b":816,"line":29,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM keys WHERE user_id = :followerId AND key_set_id IN (
 *     SELECT key_set_id
 *     FROM key_sets
 *     WHERE owner_id = :followeeId
 * )
 * ```
 */
export const removeFollowerKeys = new PreparedQuery<IRemoveFollowerKeysParams,IRemoveFollowerKeysResult>(removeFollowerKeysIR);


