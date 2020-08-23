/** Types generated for queries found in "./src/queries/users.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetById' parameters type */
export interface IGetByIdParams {
  userId: number | null | void;
}

/** 'GetById' return type */
export interface IGetByIdResult {
  id: number;
  displayName: string | null;
  displayNameIv: string | null;
}

/** 'GetById' query type */
export interface IGetByIdQuery {
  params: IGetByIdParams;
  result: IGetByIdResult;
}

const getByIdIR: any = {"name":"GetById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":84,"b":89,"line":2,"col":64}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, display_name, display_name_iv FROM users WHERE id = :userId","loc":{"a":20,"b":89,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, display_name, display_name_iv FROM users WHERE id = :userId
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

const getByFriendCodeIR: any = {"name":"GetByFriendCode","params":[{"name":"friendCode","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":163,"b":172,"line":5,"col":42}]}}],"usedParamSet":{"friendCode":true},"statement":{"body":"SELECT id FROM users WHERE friend_code = :friendCode","loc":{"a":121,"b":172,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM users WHERE friend_code = :friendCode
 * ```
 */
export const getByFriendCode = new PreparedQuery<IGetByFriendCodeParams,IGetByFriendCodeResult>(getByFriendCodeIR);


/** 'GetFriendCode' parameters type */
export interface IGetFriendCodeParams {
  userId: number | null | void;
}

/** 'GetFriendCode' return type */
export interface IGetFriendCodeResult {
  friendCode: string | null;
}

/** 'GetFriendCode' query type */
export interface IGetFriendCodeQuery {
  params: IGetFriendCodeParams;
  result: IGetFriendCodeResult;
}

const getFriendCodeIR: any = {"name":"GetFriendCode","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":244,"b":249,"line":8,"col":42}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT friend_code FROM users WHERE id = :userId","loc":{"a":202,"b":249,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT friend_code FROM users WHERE id = :userId
 * ```
 */
export const getFriendCode = new PreparedQuery<IGetFriendCodeParams,IGetFriendCodeResult>(getFriendCodeIR);


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

const setFriendCodeIR: any = {"name":"SetFriendCode","params":[{"name":"friendCode","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":311,"b":320,"line":11,"col":32}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":334,"b":339,"line":11,"col":55}]}}],"usedParamSet":{"friendCode":true,"userId":true},"statement":{"body":"UPDATE users SET friend_code = :friendCode WHERE id = :userId","loc":{"a":279,"b":339,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users SET friend_code = :friendCode WHERE id = :userId
 * ```
 */
export const setFriendCode = new PreparedQuery<ISetFriendCodeParams,ISetFriendCodeResult>(setFriendCodeIR);


