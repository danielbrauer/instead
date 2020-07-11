/** Types generated for queries found in "src/queries/users.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'Create' parameters type */
export interface ICreateParams {
  username: string | null | void;
  display_name: string | null | void;
  verifier: string | null | void;
  srp_salt: string | null | void;
  muk_salt: string | null | void;
  public_key: Json | null | void;
  private_key: string | null | void;
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

const createIR: any = {"name":"Create","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":126,"b":133,"line":2,"col":107}]}},{"name":"display_name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":137,"b":148,"line":2,"col":118}]}},{"name":"verifier","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":152,"b":159,"line":2,"col":133}]}},{"name":"srp_salt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":163,"b":170,"line":2,"col":144}]}},{"name":"muk_salt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":174,"b":181,"line":2,"col":155}]}},{"name":"public_key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":185,"b":194,"line":2,"col":166}]}},{"name":"private_key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":198,"b":208,"line":2,"col":179}]}}],"usedParamSet":{"username":true,"display_name":true,"verifier":true,"srp_salt":true,"muk_salt":true,"public_key":true,"private_key":true},"statement":{"body":"INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key) RETURNING id","loc":{"a":19,"b":222,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key) RETURNING id
 * ```
 */
export const create = new PreparedQuery<ICreateParams,ICreateResult>(createIR);


/** 'GetUserInfo' parameters type */
export interface IGetUserInfoParams {
  userId: number | null | void;
}

/** 'GetUserInfo' return type */
export interface IGetUserInfoResult {
  private_key: string;
  public_key: Json;
  muk_salt: string;
}

/** 'GetUserInfo' query type */
export interface IGetUserInfoQuery {
  params: IGetUserInfoParams;
  result: IGetUserInfoResult;
}

const getUserInfoIR: any = {"name":"GetUserInfo","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":314,"b":319,"line":5,"col":64}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT private_key, public_key, muk_salt FROM users WHERE id = :userId","loc":{"a":250,"b":319,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT private_key, public_key, muk_salt FROM users WHERE id = :userId
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

const countByNameIR: any = {"name":"CountByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":397,"b":404,"line":8,"col":50}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT COUNT(*)::int FROM users WHERE username = :username","loc":{"a":347,"b":404,"line":8,"col":0}}};

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

const getByIdIR: any = {"name":"GetById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":471,"b":476,"line":11,"col":43}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, username FROM users WHERE id = :userId","loc":{"a":428,"b":476,"line":11,"col":0}}};

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

const getByNameIR: any = {"name":"GetByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":541,"b":548,"line":14,"col":39}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id FROM users WHERE username = :username","loc":{"a":502,"b":548,"line":14,"col":0}}};

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
  srp_salt: string;
  verifier: string;
  display_name: string;
}

/** 'GetLoginInfoByName' query type */
export interface IGetLoginInfoByNameQuery {
  params: IGetLoginInfoByNameParams;
  result: IGetLoginInfoByNameResult;
}

const getLoginInfoByNameIR: any = {"name":"GetLoginInfoByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":666,"b":673,"line":17,"col":83}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username","loc":{"a":583,"b":673,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username
 * ```
 */
export const getLoginInfoByName = new PreparedQuery<IGetLoginInfoByNameParams,IGetLoginInfoByNameResult>(getLoginInfoByNameIR);


