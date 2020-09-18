/** Types generated for queries found in "src/queries/comments.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Create' parameters type */
export interface ICreateParams {
  authorId: number | null | void;
  keySetId: number | null | void;
  postId: number | null | void;
  content: string | null | void;
  contentIv: string | null | void;
}

/** 'Create' return type */
export type ICreateResult = void;

/** 'Create' query type */
export interface ICreateQuery {
  params: ICreateParams;
  result: ICreateResult;
}

const createIR: any = {"name":"Create","params":[{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":108,"b":115,"line":3,"col":9}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":119,"b":126,"line":3,"col":20}]}},{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":130,"b":135,"line":3,"col":31}]}},{"name":"content","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":139,"b":145,"line":3,"col":40}]}},{"name":"contentIv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":149,"b":157,"line":3,"col":50}]}}],"usedParamSet":{"authorId":true,"keySetId":true,"postId":true,"content":true,"contentIv":true},"statement":{"body":"INSERT INTO comments (author_id, post_key_set_id, post_id, content, content_iv)\nVALUES (:authorId, :keySetId, :postId, :content, :contentIv)","loc":{"a":19,"b":158,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO comments (author_id, post_key_set_id, post_id, content, content_iv)
 * VALUES (:authorId, :keySetId, :postId, :content, :contentIv)
 * ```
 */
export const create = new PreparedQuery<ICreateParams,ICreateResult>(createIR);


/** 'Destroy' parameters type */
export interface IDestroyParams {
  commentId: number | null | void;
  authorId: number | null | void;
}

/** 'Destroy' return type */
export type IDestroyResult = void;

/** 'Destroy' query type */
export interface IDestroyQuery {
  params: IDestroyParams;
  result: IDestroyResult;
}

const destroyIR: any = {"name":"Destroy","params":[{"name":"commentId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":215,"b":223,"line":6,"col":33}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":242,"b":249,"line":6,"col":60}]}}],"usedParamSet":{"commentId":true,"authorId":true},"statement":{"body":"DELETE FROM comments WHERE id = :commentId AND author_id = :authorId","loc":{"a":182,"b":249,"line":6,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM comments WHERE id = :commentId AND author_id = :authorId
 * ```
 */
export const destroy = new PreparedQuery<IDestroyParams,IDestroyResult>(destroyIR);


/** 'GetCommentsForPost' parameters type */
export interface IGetCommentsForPostParams {
  postId: number | null | void;
  userId: number | null | void;
}

/** 'GetCommentsForPost' return type */
export interface IGetCommentsForPostResult {
  id: number;
  authorId: number;
  content: string;
  contentIv: string;
  published: Date;
  key: string;
}

/** 'GetCommentsForPost' query type */
export interface IGetCommentsForPostQuery {
  params: IGetCommentsForPostParams;
  result: IGetCommentsForPostResult;
}

const getCommentsForPostIR: any = {"name":"GetCommentsForPost","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":455,"b":460,"line":12,"col":26}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":549,"b":554,"line":14,"col":30}]}}],"usedParamSet":{"postId":true,"userId":true},"statement":{"body":"SELECT comments.id, comments.author_id, comments.content, comments.content_iv, comments.published,\n       post_keys.key\nFROM comments, post_keys\nWHERE comments.post_id = :postId\nAND comments.post_key_set_id = post_keys.post_key_set_id\nAND post_keys.recipient_id = :userId\nORDER BY published","loc":{"a":284,"b":573,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT comments.id, comments.author_id, comments.content, comments.content_iv, comments.published,
 *        post_keys.key
 * FROM comments, post_keys
 * WHERE comments.post_id = :postId
 * AND comments.post_key_set_id = post_keys.post_key_set_id
 * AND post_keys.recipient_id = :userId
 * ORDER BY published
 * ```
 */
export const getCommentsForPost = new PreparedQuery<IGetCommentsForPostParams,IGetCommentsForPostResult>(getCommentsForPostIR);


