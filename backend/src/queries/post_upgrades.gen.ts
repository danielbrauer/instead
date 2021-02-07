/** Types generated for queries found in "src/queries/post_upgrades.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateAndReturn' parameters type */
export interface ICreateAndReturnParams {
  postId: number | null | void;
  encryptedInfo: string | null | void;
  fileName: string | null | void;
  version: number | null | void;
}

/** 'CreateAndReturn' return type */
export interface ICreateAndReturnResult {
  id: number;
}

/** 'CreateAndReturn' query type */
export interface ICreateAndReturnQuery {
  params: ICreateAndReturnParams;
  result: ICreateAndReturnResult;
}

const createAndReturnIR: any = {"name":"CreateAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":108,"b":113,"line":2,"col":80}]}},{"name":"encryptedInfo","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":117,"b":129,"line":2,"col":89}]}},{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":133,"b":140,"line":2,"col":105}]}},{"name":"version","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":144,"b":150,"line":2,"col":116}]}}],"usedParamSet":{"postId":true,"encryptedInfo":true,"fileName":true,"version":true},"statement":{"body":"INSERT INTO post_upgrades (post_id, encrypted_info, filename, version) VALUES (:postId, :encryptedInfo, :fileName, :version) RETURNING id","loc":{"a":28,"b":164,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO post_upgrades (post_id, encrypted_info, filename, version) VALUES (:postId, :encryptedInfo, :fileName, :version) RETURNING id
 * ```
 */
export const createAndReturn = new PreparedQuery<ICreateAndReturnParams,ICreateAndReturnResult>(createAndReturnIR);


/** 'ApplyAndDelete' parameters type */
export interface IApplyAndDeleteParams {
  upgradeId: number | null | void;
}

/** 'ApplyAndDelete' return type */
export type IApplyAndDeleteResult = void;

/** 'ApplyAndDelete' query type */
export interface IApplyAndDeleteQuery {
  params: IApplyAndDeleteParams;
  result: IApplyAndDeleteResult;
}

const applyAndDeleteIR: any = {"name":"ApplyAndDelete","params":[{"name":"upgradeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":311,"b":319,"line":7,"col":16}]}}],"usedParamSet":{"upgradeId":true},"statement":{"body":"WITH post_upgrade AS (\n    SELECT id, post_id, encrypted_info, filename, version FROM post_upgrades\n    WHERE id = :upgradeId\n), post AS (\n    UPDATE posts SET (encrypted_info, filename, version) = (SELECT encrypted_info, filename, version FROM post_upgrade)\n    WHERE id = (SELECT post_id FROM post_upgrade)\n)\nDELETE FROM post_upgrades\nWHERE id = (SELECT id FROM post_upgrade)","loc":{"a":195,"b":571,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH post_upgrade AS (
 *     SELECT id, post_id, encrypted_info, filename, version FROM post_upgrades
 *     WHERE id = :upgradeId
 * ), post AS (
 *     UPDATE posts SET (encrypted_info, filename, version) = (SELECT encrypted_info, filename, version FROM post_upgrade)
 *     WHERE id = (SELECT post_id FROM post_upgrade)
 * )
 * DELETE FROM post_upgrades
 * WHERE id = (SELECT id FROM post_upgrade)
 * ```
 */
export const applyAndDelete = new PreparedQuery<IApplyAndDeleteParams,IApplyAndDeleteResult>(applyAndDeleteIR);


