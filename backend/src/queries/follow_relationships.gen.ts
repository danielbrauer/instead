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

const createIR: any = {"name":"Create","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":119,"b":128,"line":4,"col":13},{"a":294,"b":303,"line":10,"col":20}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":132,"b":141,"line":4,"col":26},{"a":263,"b":272,"line":9,"col":18}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"WITH relationship AS (\n    INSERT INTO follow_relationships (follower_id, followee_id)\n    VALUES (:followerId, :followeeId)\n    RETURNING id\n)\nUPDATE profile_keys\nSET in_follow_relationship_id = (SELECT id FROM relationship)\nWHERE owner_id = :followeeId\nAND recipient_id = :followerId","loc":{"a":19,"b":303,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH relationship AS (
 *     INSERT INTO follow_relationships (follower_id, followee_id)
 *     VALUES (:followerId, :followeeId)
 *     RETURNING id
 * )
 * UPDATE profile_keys
 * SET in_follow_relationship_id = (SELECT id FROM relationship)
 * WHERE owner_id = :followeeId
 * AND recipient_id = :followerId
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

const destroyIR: any = {"name":"Destroy","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":381,"b":390,"line":13,"col":54}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":411,"b":420,"line":13,"col":84}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"DELETE FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId RETURNING follower_id, followee_id","loc":{"a":327,"b":455,"line":13,"col":0}}};

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

const countIR: any = {"name":"Count","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":545,"b":554,"line":16,"col":68}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":575,"b":584,"line":16,"col":98}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"SELECT COUNT(*)::int FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":477,"b":584,"line":16,"col":0}}};

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

const getByFolloweeIdIR: any = {"name":"GetByFolloweeId","params":[{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":686,"b":695,"line":19,"col":70}]}}],"usedParamSet":{"followeeId":true},"statement":{"body":"SELECT id, follower_id FROM follow_relationships WHERE followee_id = :followeeId","loc":{"a":616,"b":695,"line":19,"col":0}}};

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

const getByFollowerIdIR: any = {"name":"GetByFollowerId","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":793,"b":802,"line":22,"col":66}]}}],"usedParamSet":{"followerId":true},"statement":{"body":"SELECT followee_id FROM follow_relationships WHERE follower_id = :followerId","loc":{"a":727,"b":802,"line":22,"col":0}}};

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

const getExactIR: any = {"name":"GetExact","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":884,"b":893,"line":25,"col":57}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":914,"b":923,"line":25,"col":87}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"SELECT id FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":827,"b":923,"line":25,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM follow_relationships WHERE follower_id = :followerId AND followee_id = :followeeId
 * ```
 */
export const getExact = new PreparedQuery<IGetExactParams,IGetExactResult>(getExactIR);


