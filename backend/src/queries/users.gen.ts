/** Types generated for queries found in "./src/queries/users.sql" */
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

const createIR: any = {"name":"Create","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":142,"b":149,"line":3,"col":9}]}},{"name":"displayName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":153,"b":163,"line":3,"col":20}]}},{"name":"verifier","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":167,"b":174,"line":3,"col":34}]}},{"name":"srpSalt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":178,"b":184,"line":3,"col":45}]}},{"name":"mukSalt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":188,"b":194,"line":3,"col":55}]}},{"name":"publicKey","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":198,"b":206,"line":3,"col":65}]}},{"name":"privateKey","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":210,"b":219,"line":3,"col":77}]}},{"name":"privateKeyIv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":223,"b":234,"line":3,"col":90}]}}],"usedParamSet":{"username":true,"displayName":true,"verifier":true,"srpSalt":true,"mukSalt":true,"publicKey":true,"privateKey":true,"privateKeyIv":true},"statement":{"body":"INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv)\nVALUES (:username, :displayName, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv)\nRETURNING id","loc":{"a":19,"b":248,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv)
 * VALUES (:username, :displayName, :verifier, :srpSalt, :mukSalt, :publicKey, :privateKey, :privateKeyIv)
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
  friendCode: string | null;
}

/** 'GetUserInfo' query type */
export interface IGetUserInfoQuery {
  params: IGetUserInfoParams;
  result: IGetUserInfoResult;
}

const getUserInfoIR: any = {"name":"GetUserInfo","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":369,"b":374,"line":7,"col":93}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT private_key, private_key_iv, public_key, muk_salt, friend_code FROM users WHERE id = :userId","loc":{"a":276,"b":374,"line":7,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT private_key, private_key_iv, public_key, muk_salt, friend_code FROM users WHERE id = :userId
 * ```
 */
export const getUserInfo = new PreparedQuery<IGetUserInfoParams,IGetUserInfoResult>(getUserInfoIR);


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

const countByNameIR: any = {"name":"CountByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":452,"b":459,"line":10,"col":50}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT COUNT(*)::int FROM users WHERE username = :username","loc":{"a":402,"b":459,"line":10,"col":0}}};

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
  displayName: string;
}

/** 'GetById' query type */
export interface IGetByIdQuery {
  params: IGetByIdParams;
  result: IGetByIdResult;
}

const getByIdIR: any = {"name":"GetById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":540,"b":545,"line":13,"col":57}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, username, display_name FROM users WHERE id = :userId","loc":{"a":483,"b":545,"line":13,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, display_name FROM users WHERE id = :userId
 * ```
 */
export const getById = new PreparedQuery<IGetByIdParams,IGetByIdResult>(getByIdIR);


/** 'GetByFriendCode' parameters type */
export interface IGetByFriendCodeParams {
  friendCode: string | null | void;
}

/** 'GetByFriendCode' return type */
export interface IGetByFriendCodeResult {
  id: number;
}

/** 'GetByFriendCode' query type */
export interface IGetByFriendCodeQuery {
  params: IGetByFriendCodeParams;
  result: IGetByFriendCodeResult;
}

const getByFriendCodeIR: any = {"name":"GetByFriendCode","params":[{"name":"friendCode","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":619,"b":628,"line":16,"col":42}]}}],"usedParamSet":{"friendCode":true},"statement":{"body":"SELECT id FROM users WHERE friend_code = :friendCode","loc":{"a":577,"b":628,"line":16,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM users WHERE friend_code = :friendCode
 * ```
 */
export const getByFriendCode = new PreparedQuery<IGetByFriendCodeParams,IGetByFriendCodeResult>(getByFriendCodeIR);


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

const getLoginInfoByNameIR: any = {"name":"GetLoginInfoByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":746,"b":753,"line":19,"col":83}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username","loc":{"a":663,"b":753,"line":19,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username
 * ```
 */
export const getLoginInfoByName = new PreparedQuery<IGetLoginInfoByNameParams,IGetLoginInfoByNameResult>(getLoginInfoByNameIR);


/** 'SetFriendCode' parameters type */
export interface ISetFriendCodeParams {
  friendCode: string | null | void;
  userId: number | null | void;
}

/** 'SetFriendCode' return type */
export type ISetFriendCodeResult = void;

/** 'SetFriendCode' query type */
export interface ISetFriendCodeQuery {
  params: ISetFriendCodeParams;
  result: ISetFriendCodeResult;
}

const setFriendCodeIR: any = {"name":"SetFriendCode","params":[{"name":"friendCode","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":815,"b":824,"line":22,"col":32}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":838,"b":843,"line":22,"col":55}]}}],"usedParamSet":{"friendCode":true,"userId":true},"statement":{"body":"UPDATE users SET friend_code = :friendCode WHERE id = :userId","loc":{"a":783,"b":843,"line":22,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users SET friend_code = :friendCode WHERE id = :userId
 * ```
 */
export const setFriendCode = new PreparedQuery<ISetFriendCodeParams,ISetFriendCodeResult>(setFriendCodeIR);


