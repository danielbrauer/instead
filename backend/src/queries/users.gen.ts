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
  private_key_iv: string | null | void;
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

const createIR: any = {"name":"Create","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":142,"b":149,"line":2,"col":123}]}},{"name":"display_name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":153,"b":164,"line":2,"col":134}]}},{"name":"verifier","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":168,"b":175,"line":2,"col":149}]}},{"name":"srp_salt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":179,"b":186,"line":2,"col":160}]}},{"name":"muk_salt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":190,"b":197,"line":2,"col":171}]}},{"name":"public_key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":201,"b":210,"line":2,"col":182}]}},{"name":"private_key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":214,"b":224,"line":2,"col":195}]}},{"name":"private_key_iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":228,"b":241,"line":2,"col":209}]}}],"usedParamSet":{"username":true,"display_name":true,"verifier":true,"srp_salt":true,"muk_salt":true,"public_key":true,"private_key":true,"private_key_iv":true},"statement":{"body":"INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key, :private_key_iv) RETURNING id","loc":{"a":19,"b":255,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key, :private_key_iv) RETURNING id
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
  private_key_iv: string;
  public_key: Json;
  muk_salt: string;
}

/** 'GetUserInfo' query type */
export interface IGetUserInfoQuery {
  params: IGetUserInfoParams;
  result: IGetUserInfoResult;
}

const getUserInfoIR: any = {"name":"GetUserInfo","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":363,"b":368,"line":5,"col":80}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT private_key, private_key_iv, public_key, muk_salt FROM users WHERE id = :userId","loc":{"a":283,"b":368,"line":5,"col":0}}};

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

const countByNameIR: any = {"name":"CountByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":446,"b":453,"line":8,"col":50}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT COUNT(*)::int FROM users WHERE username = :username","loc":{"a":396,"b":453,"line":8,"col":0}}};

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

const getByIdIR: any = {"name":"GetById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":520,"b":525,"line":11,"col":43}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, username FROM users WHERE id = :userId","loc":{"a":477,"b":525,"line":11,"col":0}}};

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

const getByNameIR: any = {"name":"GetByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":590,"b":597,"line":14,"col":39}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id FROM users WHERE username = :username","loc":{"a":551,"b":597,"line":14,"col":0}}};

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

const getLoginInfoByNameIR: any = {"name":"GetLoginInfoByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":715,"b":722,"line":17,"col":83}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username","loc":{"a":632,"b":722,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username
 * ```
 */
export const getLoginInfoByName = new PreparedQuery<IGetLoginInfoByNameParams,IGetLoginInfoByNameResult>(getLoginInfoByNameIR);


