/** Types generated for queries found in "src/queries/keys.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'SetCurrentKeySetId' parameters type */
export interface ISetCurrentKeySetIdParams {
  keySetId: number | null | void;
  userId: number | null | void;
}

/** 'SetCurrentKeySetId' return type */
export type ISetCurrentKeySetIdResult = void;

/** 'SetCurrentKeySetId' query type */
export interface ISetCurrentKeySetIdQuery {
  params: ISetCurrentKeySetIdParams;
  result: ISetCurrentKeySetIdResult;
}

const setCurrentKeySetIdIR: any = {"name":"SetCurrentKeySetId","params":[{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":72,"b":79,"line":2,"col":41}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":93,"b":98,"line":2,"col":62}]}}],"usedParamSet":{"keySetId":true,"userId":true},"statement":{"body":"UPDATE users SET current_post_key_set = :keySetId WHERE id = :userId","loc":{"a":31,"b":98,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users SET current_post_key_set = :keySetId WHERE id = :userId
 * ```
 */
export const setCurrentKeySetId = new PreparedQuery<ISetCurrentKeySetIdParams,ISetCurrentKeySetIdResult>(setCurrentKeySetIdIR);


/** 'GetCurrentKeySetId' parameters type */
export interface IGetCurrentKeySetIdParams {
  userId: number | null | void;
}

/** 'GetCurrentKeySetId' return type */
export interface IGetCurrentKeySetIdResult {
  current_post_key_set: number | null;
}

/** 'GetCurrentKeySetId' query type */
export interface IGetCurrentKeySetIdQuery {
  params: IGetCurrentKeySetIdParams;
  result: IGetCurrentKeySetIdResult;
}

const getCurrentKeySetIdIR: any = {"name":"GetCurrentKeySetId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":184,"b":189,"line":5,"col":51}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT current_post_key_set FROM users WHERE id = :userId","loc":{"a":133,"b":189,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT current_post_key_set FROM users WHERE id = :userId
 * ```
 */
export const getCurrentKeySetId = new PreparedQuery<IGetCurrentKeySetIdParams,IGetCurrentKeySetIdResult>(getCurrentKeySetIdIR);


/** 'GetCurrentKey' parameters type */
export interface IGetCurrentKeyParams {
  userId: number | null | void;
}

/** 'GetCurrentKey' return type */
export interface IGetCurrentKeyResult {
  jwk: string;
  iv: string;
  user_id: number;
  key_set_id: number;
}

/** 'GetCurrentKey' query type */
export interface IGetCurrentKeyQuery {
  params: IGetCurrentKeyParams;
  result: IGetCurrentKeyResult;
}

const getCurrentKeyIR: any = {"name":"GetCurrentKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":255,"b":260,"line":8,"col":36},{"a":345,"b":350,"line":11,"col":16}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (\n    SELECT current_post_key_set\n    FROM users\n    WHERE id = :userId\n)","loc":{"a":219,"b":352,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM keys WHERE user_id = :userId AND key_set_id IN (
 *     SELECT current_post_key_set
 *     FROM users
 *     WHERE id = :userId
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

const getFollowerPublicKeysIR: any = {"name":"GetFollowerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":504,"b":509,"line":18,"col":25}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id IN (\n    SELECT follower_id\n    FROM followers\n    WHERE followee_id = :userId\n)","loc":{"a":390,"b":511,"line":15,"col":0}}};

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

const endKeySetValidityIR: any = {"name":"EndKeySetValidity","params":[{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":595,"b":602,"line":22,"col":50}]}}],"usedParamSet":{"keySetId":true},"statement":{"body":"UPDATE key_sets SET valid_end = now() WHERE id = :keySetId","loc":{"a":545,"b":602,"line":22,"col":0}}};

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

const createKeySetIR: any = {"name":"CreateKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":672,"b":678,"line":25,"col":41}]}}],"usedParamSet":{"ownerId":true},"statement":{"body":"INSERT INTO key_sets (owner_id) VALUES (:ownerId) RETURNING id","loc":{"a":631,"b":692,"line":25,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO key_sets (owner_id) VALUES (:ownerId) RETURNING id
 * ```
 */
export const createKeySet = new PreparedQuery<ICreateKeySetParams,ICreateKeySetResult>(createKeySetIR);


/** 'AddKey' parameters type */
export interface IAddKeyParams {
  userId: number | null | void;
  keySetId: number | null | void;
  jwk: string | null | void;
  iv: string | null | void;
}

/** 'AddKey' return type */
export type IAddKeyResult = void;

/** 'AddKey' query type */
export interface IAddKeyQuery {
  params: IAddKeyParams;
  result: IAddKeyResult;
}

const addKeyIR: any = {"name":"AddKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":772,"b":777,"line":28,"col":57}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":781,"b":788,"line":28,"col":66}]}},{"name":"jwk","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":792,"b":794,"line":28,"col":77}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":798,"b":799,"line":28,"col":83}]}}],"usedParamSet":{"userId":true,"keySetId":true,"jwk":true,"iv":true},"statement":{"body":"INSERT INTO keys (user_id, key_set_id, jwk, iv) VALUES (:userId, :keySetId, :jwk, :iv)","loc":{"a":715,"b":800,"line":28,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO keys (user_id, key_set_id, jwk, iv) VALUES (:userId, :keySetId, :jwk, :iv)
 * ```
 */
export const addKey = new PreparedQuery<IAddKeyParams,IAddKeyResult>(addKeyIR);


