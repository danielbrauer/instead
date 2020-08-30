/** Types generated for queries found in "src/queries/follow_requests.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Create' parameters type */
export interface ICreateParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
  friendCode: string | null | void;
}

/** 'Create' return type */
export type ICreateResult = void;

/** 'Create' query type */
export interface ICreateQuery {
  params: ICreateParams;
  result: ICreateResult;
}

const createIR: any = {"name":"Create","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":98,"b":108,"line":2,"col":79}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":112,"b":122,"line":2,"col":93}]}},{"name":"friendCode","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":126,"b":135,"line":2,"col":107}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true,"friendCode":true},"statement":{"body":"INSERT INTO follow_requests (requester_id, requestee_id, friend_code) VALUES (:requesterId, :requesteeId, :friendCode)","loc":{"a":19,"b":136,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO follow_requests (requester_id, requestee_id, friend_code) VALUES (:requesterId, :requesteeId, :friendCode)
 * ```
 */
export const create = new PreparedQuery<ICreateParams,ICreateResult>(createIR);


/** 'Destroy' parameters type */
export interface IDestroyParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'Destroy' return type */
export type IDestroyResult = void;

/** 'Destroy' query type */
export interface IDestroyQuery {
  params: IDestroyParams;
  result: IDestroyResult;
}

const destroyIR: any = {"name":"Destroy","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":210,"b":220,"line":5,"col":50}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":242,"b":252,"line":5,"col":82}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId","loc":{"a":160,"b":252,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId
 * ```
 */
export const destroy = new PreparedQuery<IDestroyParams,IDestroyResult>(destroyIR);


/** 'GetByIds' parameters type */
export interface IGetByIdsParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'GetByIds' return type */
export interface IGetByIdsResult {
  id: number;
}

/** 'GetByIds' query type */
export interface IGetByIdsQuery {
  params: IGetByIdsParams;
  result: IGetByIdsResult;
}

const getByIdsIR: any = {"name":"GetByIds","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":330,"b":340,"line":8,"col":53}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":362,"b":372,"line":8,"col":85}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"SELECT id FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId","loc":{"a":277,"b":372,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId
 * ```
 */
export const getByIds = new PreparedQuery<IGetByIdsParams,IGetByIdsResult>(getByIdsIR);


/** 'Count' parameters type */
export interface ICountParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
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

const countIR: any = {"name":"Count","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":458,"b":468,"line":11,"col":64}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":490,"b":500,"line":11,"col":96}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"SELECT COUNT(*)::int FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId","loc":{"a":394,"b":500,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId
 * ```
 */
export const count = new PreparedQuery<ICountParams,ICountResult>(countIR);


/** 'GetByRequesteeId' parameters type */
export interface IGetByRequesteeIdParams {
  requesteeId: number | null | void;
}

/** 'GetByRequesteeId' return type */
export interface IGetByRequesteeIdResult {
  requesterId: number;
}

/** 'GetByRequesteeId' query type */
export interface IGetByRequesteeIdQuery {
  params: IGetByRequesteeIdParams;
  result: IGetByRequesteeIdResult;
}

const getByRequesteeIdIR: any = {"name":"GetByRequesteeId","params":[{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":596,"b":606,"line":14,"col":63}]}}],"usedParamSet":{"requesteeId":true},"statement":{"body":"SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId","loc":{"a":533,"b":606,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId
 * ```
 */
export const getByRequesteeId = new PreparedQuery<IGetByRequesteeIdParams,IGetByRequesteeIdResult>(getByRequesteeIdIR);


/** 'GetByRequesterId' parameters type */
export interface IGetByRequesterIdParams {
  requesterId: number | null | void;
}

/** 'GetByRequesterId' return type */
export interface IGetByRequesterIdResult {
  requesteeId: number;
  friendCode: string | null;
}

/** 'GetByRequesterId' query type */
export interface IGetByRequesterIdQuery {
  params: IGetByRequesterIdParams;
  result: IGetByRequesterIdResult;
}

const getByRequesterIdIR: any = {"name":"GetByRequesterId","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":715,"b":725,"line":17,"col":76}]}}],"usedParamSet":{"requesterId":true},"statement":{"body":"SELECT requestee_id, friend_code FROM follow_requests WHERE requester_id = :requesterId","loc":{"a":639,"b":725,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT requestee_id, friend_code FROM follow_requests WHERE requester_id = :requesterId
 * ```
 */
export const getByRequesterId = new PreparedQuery<IGetByRequesterIdParams,IGetByRequesterIdResult>(getByRequesterIdIR);


/** 'AcceptFollowRequest' parameters type */
export interface IAcceptFollowRequestParams {
  requestId: number | null | void;
}

/** 'AcceptFollowRequest' return type */
export type IAcceptFollowRequestResult = void;

/** 'AcceptFollowRequest' query type */
export interface IAcceptFollowRequestQuery {
  params: IAcceptFollowRequestParams;
  result: IAcceptFollowRequestResult;
}

const acceptFollowRequestIR: any = {"name":"AcceptFollowRequest","params":[{"name":"requestId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":858,"b":866,"line":22,"col":16},{"a":1225,"b":1233,"line":33,"col":12}]}}],"usedParamSet":{"requestId":true},"statement":{"body":"WITH request AS (\n    SELECT id, requester_id, requestee_id FROM follow_requests\n    WHERE id = :requestId\n), relationship AS (\n    INSERT INTO follow_relationships (follower_id, followee_id)\n    SELECT requester_id, requestee_id FROM request\n    RETURNING id\n), key AS (\n    UPDATE profile_keys\n    SET out_follow_relationship_id = (SELECT id FROM relationship)\n    WHERE out_follow_request_id = (SELECT id FROM request)\n)\nDELETE FROM follow_requests\nWHERE id = :requestId","loc":{"a":761,"b":1233,"line":20,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH request AS (
 *     SELECT id, requester_id, requestee_id FROM follow_requests
 *     WHERE id = :requestId
 * ), relationship AS (
 *     INSERT INTO follow_relationships (follower_id, followee_id)
 *     SELECT requester_id, requestee_id FROM request
 *     RETURNING id
 * ), key AS (
 *     UPDATE profile_keys
 *     SET out_follow_relationship_id = (SELECT id FROM relationship)
 *     WHERE out_follow_request_id = (SELECT id FROM request)
 * )
 * DELETE FROM follow_requests
 * WHERE id = :requestId
 * ```
 */
export const acceptFollowRequest = new PreparedQuery<IAcceptFollowRequestParams,IAcceptFollowRequestResult>(acceptFollowRequestIR);


