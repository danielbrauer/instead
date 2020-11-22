/** Types generated for queries found in "src/queries/activity.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetActivityForUser' parameters type */
export interface IGetActivityForUserParams {
  userId: number | null | void;
}

/** 'GetActivityForUser' return type */
export interface IGetActivityForUserResult {
  id: number;
  authorId: number;
  published: Date;
  postId: number;
}

/** 'GetActivityForUser' query type */
export interface IGetActivityForUserQuery {
  params: IGetActivityForUserParams;
  result: IGetActivityForUserResult;
}

const getActivityForUserIR: any = {"name":"GetActivityForUser","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":196,"b":201,"line":6,"col":23},{"a":230,"b":235,"line":7,"col":27}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT comments.id, comments.author_id, comments.published,\n       posts.id AS post_id\nFROM comments, posts\nWHERE comments.post_id = posts.id\nAND posts.author_id = :userId\nAND comments.author_id <> :userId\nORDER BY comments.published DESC","loc":{"a":31,"b":268,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT comments.id, comments.author_id, comments.published,
 *        posts.id AS post_id
 * FROM comments, posts
 * WHERE comments.post_id = posts.id
 * AND posts.author_id = :userId
 * AND comments.author_id <> :userId
 * ORDER BY comments.published DESC
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

const getRecentActivityCountIR: any = {"name":"GetRecentActivityCount","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":402,"b":407,"line":15,"col":23},{"a":436,"b":441,"line":16,"col":27},{"a":526,"b":531,"line":18,"col":56}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT COUNT(*)\nFROM comments, posts\nWHERE comments.post_id = posts.id\nAND posts.author_id = :userId\nAND comments.author_id <> :userId\nAND comments.published > (\n    SELECT activity_last_checked FROM users WHERE id = :userId\n)","loc":{"a":308,"b":533,"line":12,"col":0}}};

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


