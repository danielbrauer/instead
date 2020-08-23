/** Types generated for queries found in "src/queries/follow_relationships.sql" */
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

const createIR: any = {"name":"Create","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":88,"b":97,"line":2,"col":69}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":101,"b":110,"line":2,"col":82}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"INSERT INTO follow_relationships (follower_id, followee_id) VALUES (:followerId, :followeeId)","loc":{"a":19,"b":111,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO follow_relationships (follower_id, followee_id) VALUES (:followerId, :followeeId)
 * ```
 */
export const create = new PreparedQuery<ICreateParams,ICreateResult>(createIR);


/** 'Destroy' parameters type */
export interface IDestroyParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'Destroy' return type */
export interface IDestroyResult {
  followerId: number;
  followeeId: number;
}

/** 'Destroy' query type */
export interface IDestroyQuery {
  params: IDestroyParams;
  result: IDestroyResult;
}

const destroyIR: any = {"name":"Destroy","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":189,"b":198,"line":5,"col":54}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":219,"b":228,"line":5,"col":84}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"DELETE FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId RETURNING follower_id, followee_id","loc":{"a":135,"b":263,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId RETURNING follower_id, followee_id
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
  count: number | null;
}

/** 'Count' query type */
export interface ICountQuery {
  params: ICountParams;
  result: ICountResult;
}

const countIR: any = {"name":"Count","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":353,"b":362,"line":8,"col":68}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":383,"b":392,"line":8,"col":98}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"SELECT COUNT(*)::int FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":285,"b":392,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId
 * ```
 */
export const count = new PreparedQuery<ICountParams,ICountResult>(countIR);


/** 'GetByFolloweeId' parameters type */
export interface IGetByFolloweeIdParams {
  followeeId: number | null | void;
}

/** 'GetByFolloweeId' return type */
export interface IGetByFolloweeIdResult {
  id: number;
  followerId: number;
}

/** 'GetByFolloweeId' query type */
export interface IGetByFolloweeIdQuery {
  params: IGetByFolloweeIdParams;
  result: IGetByFolloweeIdResult;
}

const getByFolloweeIdIR: any = {"name":"GetByFolloweeId","params":[{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":494,"b":503,"line":11,"col":70}]}}],"usedParamSet":{"followeeId":true},"statement":{"body":"SELECT id, follower_id FROM follow_relationships WHERE followee_id = :followeeId","loc":{"a":424,"b":503,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, follower_id FROM follow_relationships WHERE followee_id = :followeeId
 * ```
 */
export const getByFolloweeId = new PreparedQuery<IGetByFolloweeIdParams,IGetByFolloweeIdResult>(getByFolloweeIdIR);


/** 'GetByFollowerId' parameters type */
export interface IGetByFollowerIdParams {
  followerId: number | null | void;
}

/** 'GetByFollowerId' return type */
export interface IGetByFollowerIdResult {
  followeeId: number;
}

/** 'GetByFollowerId' query type */
export interface IGetByFollowerIdQuery {
  params: IGetByFollowerIdParams;
  result: IGetByFollowerIdResult;
}

const getByFollowerIdIR: any = {"name":"GetByFollowerId","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":601,"b":610,"line":14,"col":66}]}}],"usedParamSet":{"followerId":true},"statement":{"body":"SELECT followee_id FROM follow_relationships WHERE follower_id = :followerId","loc":{"a":535,"b":610,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT followee_id FROM follow_relationships WHERE follower_id = :followerId
 * ```
 */
export const getByFollowerId = new PreparedQuery<IGetByFollowerIdParams,IGetByFollowerIdResult>(getByFollowerIdIR);


/** 'GetExact' parameters type */
export interface IGetExactParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'GetExact' return type */
export interface IGetExactResult {
  id: number;
}

/** 'GetExact' query type */
export interface IGetExactQuery {
  params: IGetExactParams;
  result: IGetExactResult;
}

const getExactIR: any = {"name":"GetExact","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":692,"b":701,"line":17,"col":57}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":722,"b":731,"line":17,"col":87}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"SELECT id FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":635,"b":731,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId
 * ```
 */
export const getExact = new PreparedQuery<IGetExactParams,IGetExactResult>(getExactIR);


