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

const getActivityForUserIR: any = {"name":"GetActivityForUser","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":196,"b":201,"line":6,"col":23}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT comments.id, comments.author_id, comments.published,\n       posts.id AS post_id\nFROM comments, posts\nWHERE comments.post_id = posts.id\nAND posts.author_id = :userId\nORDER BY comments.published DESC","loc":{"a":31,"b":234,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT comments.id, comments.author_id, comments.published,
 *        posts.id AS post_id
 * FROM comments, posts
 * WHERE comments.post_id = posts.id
 * AND posts.author_id = :userId
 * ORDER BY comments.published DESC
 * ```
 */
export const getActivityForUser = new PreparedQuery<IGetActivityForUserParams,IGetActivityForUserResult>(getActivityForUserIR);


