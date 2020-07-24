/** Types generated for queries found in "src/queries/users.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'Create' parameters type */
export interface ICreateParams {
  username: string | null | void;
  displayName: string | null | void;
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

const createIR: any = {"name":"Create","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":142,"b":149,"line":2,"col":123}]}},{"name":"displayName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":153,"b":163,"line":2,"col":134}]}},{"name":"verifier","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":167,"b":174,"line":2,"col":148}]}},{"name":"srpSalt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":178,"b":184,"line":2,"col":159}]}},{"name":"mukSalt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":188,"b":194,"line":2,"col":169}]}},{"name":"publicKey","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":198,"b":206,"line":2,"col":179}]}},{"name":"privateKey","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":210,"b":219,"line":2,"col":191}]}},{"name":"privateKeyIv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":223,"b":234,"line":2,"col":204}]}}],"usedParamSet":{"username":true,"displayName":true,"verifier":true,"srpSalt":true,"mukSalt":true,"publicKey":true,"privateKey":true,"privateKeyIv":true},"statement":{"body":"INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :displayName, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv) RETURNING id","loc":{"a":19,"b":248,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :displayName, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv) RETURNING id
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

const getUserInfoIR: any = {"name":"GetUserInfo","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":356,"b":361,"line":5,"col":80}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT private_key, private_key_iv, public_key, muk_salt FROM users WHERE id = :userId","loc":{"a":276,"b":361,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT private_key, private_key_iv, public_key, muk_salt FROM users WHERE id = :userId
 * ```
 */
export const getUserInfo = new PreparedQuery<IGetUserInfoParams,IGetUserInfoResult>(getUserInfoIR);


/** 'CountByName' parameters type */
export interface ICountByNameParams {
  username: string | null | void;
}

/** 'CountByName' return type */
export interface ICountByNameResult {
  count: number;
}

/** 'CountByName' query type */
export interface ICountByNameQuery {
  params: ICountByNameParams;
  result: ICountByNameResult;
}

const countByNameIR: any = {"name":"CountByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":439,"b":446,"line":8,"col":50}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT COUNT(*)::int FROM users WHERE username = :username","loc":{"a":389,"b":446,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int FROM users WHERE username = :username
 * ```
 */
export const countByName = new PreparedQuery<ICountByNameParams,ICountByNameResult>(countByNameIR);


/** 'GetById' parameters type */
export interface IGetByIdParams {
  userId: number | null | void;
}

/** 'GetById' return type */
export interface IGetByIdResult {
  id: number;
  username: string;
}

/** 'GetById' query type */
export interface IGetByIdQuery {
  params: IGetByIdParams;
  result: IGetByIdResult;
}

const getByIdIR: any = {"name":"GetById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":513,"b":518,"line":11,"col":43}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, username FROM users WHERE id = :userId","loc":{"a":470,"b":518,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username FROM users WHERE id = :userId
 * ```
 */
export const getById = new PreparedQuery<IGetByIdParams,IGetByIdResult>(getByIdIR);


/** 'GetByName' parameters type */
export interface IGetByNameParams {
  username: string | null | void;
}

/** 'GetByName' return type */
export interface IGetByNameResult {
  id: number;
}

/** 'GetByName' query type */
export interface IGetByNameQuery {
  params: IGetByNameParams;
  result: IGetByNameResult;
}

const getByNameIR: any = {"name":"GetByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":583,"b":590,"line":14,"col":39}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id FROM users WHERE username = :username","loc":{"a":544,"b":590,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM users WHERE username = :username
 * ```
 */
export const getByName = new PreparedQuery<IGetByNameParams,IGetByNameResult>(getByNameIR);


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
  displayName: string;
}

/** 'GetLoginInfoByName' query type */
export interface IGetLoginInfoByNameQuery {
  params: IGetLoginInfoByNameParams;
  result: IGetLoginInfoByNameResult;
}

const getLoginInfoByNameIR: any = {"name":"GetLoginInfoByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":708,"b":715,"line":17,"col":83}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username","loc":{"a":625,"b":715,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username
 * ```
 */
export const getLoginInfoByName = new PreparedQuery<IGetLoginInfoByNameParams,IGetLoginInfoByNameResult>(getLoginInfoByNameIR);


