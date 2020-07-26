/** Types generated for queries found in "src/queries/keys.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetCurrentKeySetId' parameters type */
export interface IGetCurrentKeySetIdParams {
  userId: number | null | void;
}

/** 'GetCurrentKeySetId' return type */
export interface IGetCurrentKeySetIdResult {
  id: number;
}

/** 'GetCurrentKeySetId' query type */
export interface IGetCurrentKeySetIdQuery {
  params: IGetCurrentKeySetIdParams;
  result: IGetCurrentKeySetIdResult;
}

const getCurrentKeySetIdIR: any = {"name":"GetCurrentKeySetId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":73,"b":78,"line":2,"col":42}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id FROM key_sets WHERE owner_id = :userId AND valid_end IS NULL","loc":{"a":31,"b":100,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM key_sets WHERE owner_id = :userId AND valid_end IS NULL
 * ```
 */
export const getCurrentKeySetId = new PreparedQuery<IGetCurrentKeySetIdParams,IGetCurrentKeySetIdResult>(getCurrentKeySetIdIR);


/** 'GetCurrentKey' parameters type */
export interface IGetCurrentKeyParams {
  userId: number | null | void;
}

/** 'GetCurrentKey' return type */
export interface IGetCurrentKeyResult {
  key: string;
  user_id: number;
  key_set_id: number;
}

/** 'GetCurrentKey' query type */
export interface IGetCurrentKeyQuery {
  params: IGetCurrentKeyParams;
  result: IGetCurrentKeyResult;
}

const getCurrentKeyIR: any = {"name":"GetCurrentKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":166,"b":171,"line":5,"col":36},{"a":247,"b":252,"line":8,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (\n    SELECT id\n    FROM key_sets\n    WHERE owner_id = :userId AND valid_end IS NULL\n)","loc":{"a":130,"b":276,"line":5,"col":0}}};

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
  public_key: Json;
}

/** 'GetFollowerPublicKeys' query type */
export interface IGetFollowerPublicKeysQuery {
  params: IGetFollowerPublicKeysParams;
  result: IGetFollowerPublicKeysResult;
}

const getFollowerPublicKeysIR: any = {"name":"GetFollowerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":428,"b":433,"line":15,"col":25}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id IN (\n    SELECT follower_id\n    FROM followers\n    WHERE followee_id = :userId\n)","loc":{"a":314,"b":435,"line":12,"col":0}}};

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

const endKeySetValidityIR: any = {"name":"EndKeySetValidity","params":[{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":519,"b":526,"line":19,"col":50}]}}],"usedParamSet":{"keySetId":true},"statement":{"body":"UPDATE key_sets SET valid_end = now() WHERE id = :keySetId","loc":{"a":469,"b":526,"line":19,"col":0}}};

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

const createKeySetIR: any = {"name":"CreateKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":596,"b":602,"line":22,"col":41}]}}],"usedParamSet":{"ownerId":true},"statement":{"body":"INSERT INTO key_sets (owner_id) VALUES (:ownerId) RETURNING id","loc":{"a":555,"b":616,"line":22,"col":0}}};

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
    user_id: number,
    key_set_id: number,
    key: string
  }>;
}

/** 'AddKeys' return type */
export type IAddKeysResult = void;

/** 'AddKeys' query type */
export interface IAddKeysQuery {
  params: IAddKeysParams;
  result: IAddKeysResult;
}

const addKeysIR: any = {"name":"AddKeys","params":[{"name":"keys","codeRefs":{"defined":{"a":652,"b":655,"line":26,"col":11},"used":[{"a":747,"b":750,"line":29,"col":8}]},"transform":{"type":"pick_array_spread","keys":["user_id","key_set_id","key"]}}],"usedParamSet":{"keys":true},"statement":{"body":"INSERT INTO keys (user_id, key_set_id, key)\nVALUES :keys","loc":{"a":695,"b":750,"line":28,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO keys (user_id, key_set_id, key)
 * VALUES :keys
 * ```
 */
export const addKeys = new PreparedQuery<IAddKeysParams,IAddKeysResult>(addKeysIR);


