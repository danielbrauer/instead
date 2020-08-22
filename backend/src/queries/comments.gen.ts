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

const createIR: any = {"name":"Create","params":[{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":103,"b":110,"line":3,"col":9}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":114,"b":121,"line":3,"col":20}]}},{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":125,"b":130,"line":3,"col":31}]}},{"name":"content","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":134,"b":140,"line":3,"col":40}]}},{"name":"contentIv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":144,"b":152,"line":3,"col":50}]}}],"usedParamSet":{"authorId":true,"keySetId":true,"postId":true,"content":true,"contentIv":true},"statement":{"body":"INSERT INTO comments (author_id, key_set_id, post_id, content, content_iv)\nVALUES (:authorId, :keySetId, :postId, :content, :contentIv)","loc":{"a":19,"b":153,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO comments (author_id, key_set_id, post_id, content, content_iv)
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

const destroyIR: any = {"name":"Destroy","params":[{"name":"commentId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":210,"b":218,"line":6,"col":33}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":237,"b":244,"line":6,"col":60}]}}],"usedParamSet":{"commentId":true,"authorId":true},"statement":{"body":"DELETE FROM comments WHERE id = :commentId AND author_id = :authorId","loc":{"a":177,"b":244,"line":6,"col":0}}};

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

const getCommentsForPostIR: any = {"name":"GetCommentsForPost","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":440,"b":445,"line":12,"col":26}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":509,"b":514,"line":14,"col":20}]}}],"usedParamSet":{"postId":true,"userId":true},"statement":{"body":"SELECT comments.id, comments.author_id, comments.content, comments.content_iv, comments.published,\n       keys.key\nFROM comments, keys\nWHERE comments.post_id = :postId\nAND comments.key_set_id = keys.key_set_id\nAND keys.user_id = :userId\nORDER BY published","loc":{"a":279,"b":533,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT comments.id, comments.author_id, comments.content, comments.content_iv, comments.published,
 *        keys.key
 * FROM comments, keys
 * WHERE comments.post_id = :postId
 * AND comments.key_set_id = keys.key_set_id
 * AND keys.user_id = :userId
 * ORDER BY published
 * ```
 */
export const getCommentsForPost = new PreparedQuery<IGetCommentsForPostParams,IGetCommentsForPostResult>(getCommentsForPostIR);


