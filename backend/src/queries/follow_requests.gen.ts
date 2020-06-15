/** Types generated for queries found in "src/queries/follow_requests.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Create' parameters type */
export interface ICreateParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'Create' return type */
export type ICreateResult = void;

/** 'Create' query type */
export interface ICreateQuery {
  params: ICreateParams;
  result: ICreateResult;
}

const createIR: any = {"name":"Create","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":85,"b":95,"line":2,"col":66}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":99,"b":109,"line":2,"col":80}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"INSERT INTO follow_requests (requester_id, requestee_id) VALUES (:requesterId, :requesteeId)","loc":{"a":19,"b":110,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO follow_requests (requester_id, requestee_id) VALUES (:requesterId, :requesteeId)
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

const destroyIR: any = {"name":"Destroy","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":184,"b":194,"line":5,"col":50}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":216,"b":226,"line":5,"col":82}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId","loc":{"a":134,"b":226,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId
 * ```
 */
export const destroy = new PreparedQuery<IDestroyParams,IDestroyResult>(destroyIR);


/** 'DestroyAndReturn' parameters type */
export interface IDestroyAndReturnParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'DestroyAndReturn' return type */
export interface IDestroyAndReturnResult {
  requester_id: number;
  requestee_id: number;
  timestamp: Date;
}

/** 'DestroyAndReturn' query type */
export interface IDestroyAndReturnQuery {
  params: IDestroyAndReturnParams;
  result: IDestroyAndReturnResult;
}

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":309,"b":319,"line":8,"col":50}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":341,"b":351,"line":8,"col":82}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId RETURNING *","loc":{"a":259,"b":363,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId RETURNING *
 * ```
 */
export const destroyAndReturn = new PreparedQuery<IDestroyAndReturnParams,IDestroyAndReturnResult>(destroyAndReturnIR);


/** 'Count' parameters type */
export interface ICountParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
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

const countIR: any = {"name":"Count","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":444,"b":454,"line":11,"col":59}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":476,"b":486,"line":11,"col":91}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"SELECT COUNT(*) FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId","loc":{"a":385,"b":486,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId
 * ```
 */
export const count = new PreparedQuery<ICountParams,ICountResult>(countIR);


/** 'GetByRequesteeId' parameters type */
export interface IGetByRequesteeIdParams {
  requesteeId: number | null | void;
}

/** 'GetByRequesteeId' return type */
export interface IGetByRequesteeIdResult {
  requester_id: number;
}

/** 'GetByRequesteeId' query type */
export interface IGetByRequesteeIdQuery {
  params: IGetByRequesteeIdParams;
  result: IGetByRequesteeIdResult;
}

const getByRequesteeIdIR: any = {"name":"GetByRequesteeId","params":[{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":582,"b":592,"line":14,"col":63}]}}],"usedParamSet":{"requesteeId":true},"statement":{"body":"SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId","loc":{"a":519,"b":592,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId
 * ```
 */
export const getByRequesteeId = new PreparedQuery<IGetByRequesteeIdParams,IGetByRequesteeIdResult>(getByRequesteeIdIR);


