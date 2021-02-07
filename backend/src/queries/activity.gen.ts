/** Types generated for queries found in "src/queries/activity.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetActivityForUser' parameters type */
export interface IGetActivityForUserParams {
  userId: number | null | void;
  pageIndex: string | null | void;
}

/** 'GetActivityForUser' return type */
export interface IGetActivityForUserResult {
  id: number;
  authorId: number;
  published: Date;
  index: string | null;
  postId: number;
}

/** 'GetActivityForUser' query type */
export interface IGetActivityForUserQuery {
  params: IGetActivityForUserParams;
  result: IGetActivityForUserResult;
}

const getActivityForUserIR: any = {"name":"GetActivityForUser","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":243,"b":248,"line":6,"col":23},{"a":277,"b":282,"line":7,"col":27}]}},{"name":"pageIndex","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":325,"b":333,"line":9,"col":6},{"a":391,"b":399,"line":9,"col":72}]}}],"usedParamSet":{"userId":true,"pageIndex":true},"statement":{"body":"SELECT comments.id, comments.author_id, comments.published, timestamp_to_int(comments.published) AS index,\n       posts.id AS post_id\nFROM comments, posts\nWHERE comments.post_id = posts.id\nAND posts.author_id = :userId\nAND comments.author_id <> :userId\nAND comments.published IS NOT NULL\nAND (:pageIndex::int8 IS NULL OR comments.published < int_to_timestamp(:pageIndex::int8))\nORDER BY comments.published DESC\nLIMIT 3","loc":{"a":31,"b":448,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT comments.id, comments.author_id, comments.published, timestamp_to_int(comments.published) AS index,
 *        posts.id AS post_id
 * FROM comments, posts
 * WHERE comments.post_id = posts.id
 * AND posts.author_id = :userId
 * AND comments.author_id <> :userId
 * AND comments.published IS NOT NULL
 * AND (:pageIndex::int8 IS NULL OR comments.published < int_to_timestamp(:pageIndex::int8))
 * ORDER BY comments.published DESC
 * LIMIT 3
 * ```
 */
export const getActivityForUser = new PreparedQuery<IGetActivityForUserParams,IGetActivityForUserResult>(getActivityForUserIR);


/** 'GetRecentActivityCount' parameters type */
export interface IGetRecentActivityCountParams {
  userId: number | null | void;
}

/** 'GetRecentActivityCount' return type */
export interface IGetRecentActivityCountResult {
  count: string | null;
}

/** 'GetRecentActivityCount' query type */
export interface IGetRecentActivityCountQuery {
  params: IGetRecentActivityCountParams;
  result: IGetRecentActivityCountResult;
}

const getRecentActivityCountIR: any = {"name":"GetRecentActivityCount","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":582,"b":587,"line":18,"col":23},{"a":616,"b":621,"line":19,"col":27},{"a":706,"b":711,"line":21,"col":56}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT COUNT(*)\nFROM comments, posts\nWHERE comments.post_id = posts.id\nAND posts.author_id = :userId\nAND comments.author_id <> :userId\nAND comments.published > (\n    SELECT activity_last_checked FROM users WHERE id = :userId\n)","loc":{"a":488,"b":713,"line":15,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)
 * FROM comments, posts
 * WHERE comments.post_id = posts.id
 * AND posts.author_id = :userId
 * AND comments.author_id <> :userId
 * AND comments.published > (
 *     SELECT activity_last_checked FROM users WHERE id = :userId
 * )
 * ```
 */
export const getRecentActivityCount = new PreparedQuery<IGetRecentActivityCountParams,IGetRecentActivityCountResult>(getRecentActivityCountIR);


