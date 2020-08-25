/** Types generated for queries found in "./src/queries/users.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetProfileWithKey' parameters type */
export interface IGetProfileWithKeyParams {
  userId: number | null | void;
  requesterId: number | null | void;
}

/** 'GetProfileWithKey' return type */
export interface IGetProfileWithKeyResult {
  id: number;
  displayName: string | null;
  displayNameIv: string | null;
  key: string;
}

/** 'GetProfileWithKey' query type */
export interface IGetProfileWithKeyQuery {
  params: IGetProfileWithKeyParams;
  result: IGetProfileWithKeyResult;
}

const getProfileWithKeyIR: any = {"name":"GetProfileWithKey","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":194,"b":199,"line":6,"col":16}]}},{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":234,"b":244,"line":7,"col":33}]}}],"usedParamSet":{"userId":true,"requesterId":true},"statement":{"body":"SELECT users.id, users.display_name, users.display_name_iv,\n       profile_keys.key\nFROM users, profile_keys\nWHERE users.id = profile_keys.owner_id\nAND users.id = :userId\nAND profile_keys.recipient_id = :requesterId","loc":{"a":30,"b":244,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT users.id, users.display_name, users.display_name_iv,
 *        profile_keys.key
 * FROM users, profile_keys
 * WHERE users.id = profile_keys.owner_id
 * AND users.id = :userId
 * AND profile_keys.recipient_id = :requesterId
 * ```
 */
export const getProfileWithKey = new PreparedQuery<IGetProfileWithKeyParams,IGetProfileWithKeyResult>(getProfileWithKeyIR);


/** 'SetProfileData' parameters type */
export interface ISetProfileDataParams {
  displayName: string | null | void;
  displayNameIv: string | null | void;
  userId: number | null | void;
}

/** 'SetProfileData' return type */
export type ISetProfileDataResult = void;

/** 'SetProfileData' query type */
export interface ISetProfileDataQuery {
  params: ISetProfileDataParams;
  result: ISetProfileDataResult;
}

const setProfileDataIR: any = {"name":"SetProfileData","params":[{"name":"displayName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":308,"b":318,"line":10,"col":33}]}},{"name":"displayNameIv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":340,"b":352,"line":10,"col":65}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":366,"b":371,"line":10,"col":91}]}}],"usedParamSet":{"displayName":true,"displayNameIv":true,"userId":true},"statement":{"body":"UPDATE users SET display_name = :displayName, display_name_iv = :displayNameIv WHERE id = :userId","loc":{"a":275,"b":371,"line":10,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users SET display_name = :displayName, display_name_iv = :displayNameIv WHERE id = :userId
 * ```
 */
export const setProfileData = new PreparedQuery<ISetProfileDataParams,ISetProfileDataResult>(setProfileDataIR);


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

const getByFriendCodeIR: any = {"name":"GetByFriendCode","params":[{"name":"friendCode","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":445,"b":454,"line":13,"col":42}]}}],"usedParamSet":{"friendCode":true},"statement":{"body":"SELECT id FROM users WHERE friend_code = :friendCode","loc":{"a":403,"b":454,"line":13,"col":0}}};

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

const getFriendCodeIR: any = {"name":"GetFriendCode","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":526,"b":531,"line":16,"col":42}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT friend_code FROM users WHERE id = :userId","loc":{"a":484,"b":531,"line":16,"col":0}}};

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

const setFriendCodeIR: any = {"name":"SetFriendCode","params":[{"name":"friendCode","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":593,"b":602,"line":19,"col":32}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":616,"b":621,"line":19,"col":55}]}}],"usedParamSet":{"friendCode":true,"userId":true},"statement":{"body":"UPDATE users SET friend_code = :friendCode WHERE id = :userId","loc":{"a":561,"b":621,"line":19,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users SET friend_code = :friendCode WHERE id = :userId
 * ```
 */
export const setFriendCode = new PreparedQuery<ISetFriendCodeParams,ISetFriendCodeResult>(setFriendCodeIR);


