/** Types generated for queries found in "./src/queries/users-auth.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'Create' parameters type */
export interface ICreateParams {
  username: string | null | void;
  verifier: string | null | void;
  srpSalt: string | null | void;
  mukSalt: string | null | void;
  publicKey: Json | null | void;
  privateKey: string | null | void;
  privateKeyIv: string | null | void;
}

/** 'Create' return type */
export interface ICreateResult {
  id: number;
}

/** 'Create' query type */
export interface ICreateQuery {
  params: ICreateParams;
  result: ICreateResult;
}

const createIR: any = {"name":"Create","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":128,"b":135,"line":3,"col":9}]}},{"name":"verifier","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":139,"b":146,"line":3,"col":20}]}},{"name":"srpSalt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":150,"b":156,"line":3,"col":31}]}},{"name":"mukSalt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":160,"b":166,"line":3,"col":41}]}},{"name":"publicKey","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":170,"b":178,"line":3,"col":51}]}},{"name":"privateKey","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":182,"b":191,"line":3,"col":63}]}},{"name":"privateKeyIv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":195,"b":206,"line":3,"col":76}]}}],"usedParamSet":{"username":true,"verifier":true,"srpSalt":true,"mukSalt":true,"publicKey":true,"privateKey":true,"privateKeyIv":true},"statement":{"body":"INSERT INTO users (username, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv)\nVALUES (:username, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv)\nRETURNING id","loc":{"a":19,"b":220,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv)
 * VALUES (:username, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv)
 * RETURNING id
 * ```
 */
export const create = new PreparedQuery<ICreateParams,ICreateResult>(createIR);


/** 'GetUserInfo' parameters type */
export interface IGetUserInfoParams {
  userId: number | null | void;
}

/** 'GetUserInfo' return type */
export interface IGetUserInfoResult {
  privateKey: string;
  privateKeyIv: string;
  publicKey: Json;
  mukSalt: string;
}

/** 'GetUserInfo' query type */
export interface IGetUserInfoQuery {
  params: IGetUserInfoParams;
  result: IGetUserInfoResult;
}

const getUserInfoIR: any = {"name":"GetUserInfo","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":328,"b":333,"line":7,"col":80}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT private_key, private_key_iv, public_key, muk_salt FROM users WHERE id = :userId","loc":{"a":248,"b":333,"line":7,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT private_key, private_key_iv, public_key, muk_salt FROM users WHERE id = :userId
 * ```
 */
export const getUserInfo = new PreparedQuery<IGetUserInfoParams,IGetUserInfoResult>(getUserInfoIR);


/** 'GetLoginInfoByName' parameters type */
export interface IGetLoginInfoByNameParams {
  username: string | null | void;
}

/** 'GetLoginInfoByName' return type */
export interface IGetLoginInfoByNameResult {
  id: number;
  username: string;
  srpSalt: string;
  verifier: string;
}

/** 'GetLoginInfoByName' query type */
export interface IGetLoginInfoByNameQuery {
  params: IGetLoginInfoByNameParams;
  result: IGetLoginInfoByNameResult;
}

const getLoginInfoByNameIR: any = {"name":"GetLoginInfoByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":437,"b":444,"line":10,"col":69}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id, username, srp_salt, verifier FROM users WHERE username = :username","loc":{"a":368,"b":444,"line":10,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, srp_salt, verifier FROM users WHERE username = :username
 * ```
 */
export const getLoginInfoByName = new PreparedQuery<IGetLoginInfoByNameParams,IGetLoginInfoByNameResult>(getLoginInfoByNameIR);


/** 'CountByName' parameters type */
export interface ICountByNameParams {
  username: string | null | void;
}

/** 'CountByName' return type */
export interface ICountByNameResult {
  count: number | null;
}

/** 'CountByName' query type */
export interface ICountByNameQuery {
  params: ICountByNameParams;
  result: ICountByNameResult;
}

const countByNameIR: any = {"name":"CountByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":522,"b":529,"line":13,"col":50}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT COUNT(*)::int FROM users WHERE username = :username","loc":{"a":472,"b":529,"line":13,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int FROM users WHERE username = :username
 * ```
 */
export const countByName = new PreparedQuery<ICountByNameParams,ICountByNameResult>(countByNameIR);


