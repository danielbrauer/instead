/** Types generated for queries found in "src/queries/followers.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Create' parameters type */
export interface ICreateParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'Create' return type */
export type ICreateResult = void;

/** 'Create' query type */
export interface ICreateQuery {
  params: ICreateParams;
  result: ICreateResult;
}

const createIR: any = {"name":"Create","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":77,"b":86,"line":2,"col":58}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":90,"b":99,"line":2,"col":71}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"INSERT INTO followers (follower_id, followee_id) VALUES (:followerId, :followeeId)","loc":{"a":19,"b":100,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO followers (follower_id, followee_id) VALUES (:followerId, :followeeId)
 * ```
 */
export const create = new PreparedQuery<ICreateParams,ICreateResult>(createIR);


/** 'Destroy' parameters type */
export interface IDestroyParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'Destroy' return type */
export type IDestroyResult = void;

/** 'Destroy' query type */
export interface IDestroyQuery {
  params: IDestroyParams;
  result: IDestroyResult;
}

const destroyIR: any = {"name":"Destroy","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":167,"b":176,"line":5,"col":43}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":197,"b":206,"line":5,"col":73}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"DELETE FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":124,"b":206,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId
 * ```
 */
export const destroy = new PreparedQuery<IDestroyParams,IDestroyResult>(destroyIR);


/** 'Count' parameters type */
export interface ICountParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'Count' return type */
export interface ICountResult {
  count: number;
}

/** 'Count' query type */
export interface ICountQuery {
  params: ICountParams;
  result: ICountResult;
}

const countIR: any = {"name":"Count","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":280,"b":289,"line":8,"col":52}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":310,"b":319,"line":8,"col":82}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"SELECT COUNT(*) FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":228,"b":319,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId
 * ```
 */
export const count = new PreparedQuery<ICountParams,ICountResult>(countIR);


/** 'GetByFolloweeId' parameters type */
export interface IGetByFolloweeIdParams {
  followeeId: number | null | void;
}

/** 'GetByFolloweeId' return type */
export interface IGetByFolloweeIdResult {
  follower_id: number;
}

/** 'GetByFolloweeId' query type */
export interface IGetByFolloweeIdQuery {
  params: IGetByFolloweeIdParams;
  result: IGetByFolloweeIdResult;
}

const getByFolloweeIdIR: any = {"name":"GetByFolloweeId","params":[{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":406,"b":415,"line":11,"col":55}]}}],"usedParamSet":{"followeeId":true},"statement":{"body":"SELECT follower_id FROM followers WHERE followee_id = :followeeId","loc":{"a":351,"b":415,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT follower_id FROM followers WHERE followee_id = :followeeId
 * ```
 */
export const getByFolloweeId = new PreparedQuery<IGetByFolloweeIdParams,IGetByFolloweeIdResult>(getByFolloweeIdIR);


/** 'GetByFollowerId' parameters type */
export interface IGetByFollowerIdParams {
  followerId: number | null | void;
}

/** 'GetByFollowerId' return type */
export interface IGetByFollowerIdResult {
  followee_id: number;
}

/** 'GetByFollowerId' query type */
export interface IGetByFollowerIdQuery {
  params: IGetByFollowerIdParams;
  result: IGetByFollowerIdResult;
}

const getByFollowerIdIR: any = {"name":"GetByFollowerId","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":502,"b":511,"line":14,"col":55}]}}],"usedParamSet":{"followerId":true},"statement":{"body":"SELECT followee_id FROM followers WHERE follower_id = :followerId","loc":{"a":447,"b":511,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT followee_id FROM followers WHERE follower_id = :followerId
 * ```
 */
export const getByFollowerId = new PreparedQuery<IGetByFollowerIdParams,IGetByFollowerIdResult>(getByFollowerIdIR);


