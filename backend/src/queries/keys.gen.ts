/** Types generated for queries found in "src/queries/keys.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetKey' parameters type */
export interface IGetKeyParams {
  userId: number | null | void;
  keySetId: number | null | void;
}

/** 'GetKey' return type */
export interface IGetKeyResult {
  key: string;
  recipientId: number;
  postKeySetId: number;
  id: number;
  followRelationshipId: number | null;
}

/** 'GetKey' query type */
export interface IGetKeyQuery {
  params: IGetKeyParams;
  result: IGetKeyResult;
}

const getKeyIR: any = {"name":"GetKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":65,"b":70,"line":2,"col":46}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":95,"b":102,"line":2,"col":76}]}}],"usedParamSet":{"userId":true,"keySetId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId","loc":{"a":19,"b":102,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id = :keySetId
 * ```
 */
export const getKey = new PreparedQuery<IGetKeyParams,IGetKeyResult>(getKeyIR);


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

const getFollowerPublicKeysIR: any = {"name":"GetFollowerPublicKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":265,"b":270,"line":8,"col":25}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id IN (\n    SELECT follower_id\n    FROM follow_relationships\n    WHERE followee_id = :userId\n)","loc":{"a":140,"b":272,"line":5,"col":0}}};

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

const getPublicKeyIR: any = {"name":"GetPublicKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":346,"b":351,"line":12,"col":45}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, public_key FROM users WHERE id = :userId","loc":{"a":301,"b":351,"line":12,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, public_key FROM users WHERE id = :userId
 * ```
 */
export const getPublicKey = new PreparedQuery<IGetPublicKeyParams,IGetPublicKeyResult>(getPublicKeyIR);


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

const getCurrentPostKeyIR: any = {"name":"GetCurrentPostKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":431,"b":436,"line":15,"col":46},{"a":522,"b":527,"line":18,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId AND valid_end IS NULL\n)","loc":{"a":385,"b":551,"line":15,"col":0}}};

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

const getAllPostKeysIR: any = {"name":"GetAllPostKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":628,"b":633,"line":22,"col":46},{"a":719,"b":724,"line":25,"col":22}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM post_keys WHERE recipient_id = :userId AND post_key_set_id IN (\n    SELECT id\n    FROM post_key_sets\n    WHERE owner_id = :userId\n)","loc":{"a":582,"b":726,"line":22,"col":0}}};

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

const endCurrentPostKeySetValidityIR: any = {"name":"EndCurrentPostKeySetValidity","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":832,"b":837,"line":31,"col":18}]}}],"usedParamSet":{"userId":true},"statement":{"body":"UPDATE post_key_sets\nSET valid_end = now()\nWHERE owner_id = :userId AND valid_end IS NULL","loc":{"a":771,"b":859,"line":29,"col":0}}};

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

const createCurrentPostKeySetIR: any = {"name":"CreateCurrentPostKeySet","params":[{"name":"ownerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":983,"b":989,"line":36,"col":13},{"a":1079,"b":1085,"line":40,"col":9}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1126,"b":1128,"line":40,"col":56}]}}],"usedParamSet":{"ownerId":true,"key":true},"statement":{"body":"WITH new_post_key_set_id AS (\n    INSERT INTO post_key_sets (owner_id)\n    VALUES (:ownerId)\n    RETURNING id\n)\nINSERT INTO post_keys (recipient_id, post_key_set_id, key)\nVALUES (:ownerId, (SELECT * FROM new_post_key_set_id), :key)\nRETURNING post_key_set_id","loc":{"a":899,"b":1155,"line":34,"col":0}}};

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

const addPostKeysIR: any = {"name":"AddPostKeys","params":[{"name":"keysWithFollowerIds","codeRefs":{"defined":{"a":1195,"b":1213,"line":45,"col":11},"used":[{"a":1372,"b":1390,"line":48,"col":8}]},"transform":{"type":"pick_array_spread","keys":["recipientId","postKeySetId","key","followRelationshipId"]}}],"usedParamSet":{"keysWithFollowerIds":true},"statement":{"body":"INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)\nVALUES :keysWithFollowerIds","loc":{"a":1281,"b":1390,"line":47,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO post_keys (recipient_id, post_key_set_id, key, follow_relationship_id)
 * VALUES :keysWithFollowerIds
 * ```
 */
export const addPostKeys = new PreparedQuery<IAddPostKeysParams,IAddPostKeysResult>(addPostKeysIR);


