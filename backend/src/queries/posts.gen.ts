/** Types generated for queries found in "src/queries/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateAndReturn' parameters type */
export interface ICreateAndReturnParams {
  fileName: string | null | void;
  authorId: number | null | void;
  keySetId: number | null | void;
  iv: string | null | void;
  aspect: number | null | void;
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

const createAndReturnIR: any = {"name":"CreateAndReturn","params":[{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":101,"b":108,"line":2,"col":73}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":112,"b":119,"line":2,"col":84}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":123,"b":130,"line":2,"col":95}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":134,"b":135,"line":2,"col":106}]}},{"name":"aspect","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":139,"b":144,"line":2,"col":111}]}}],"usedParamSet":{"fileName":true,"authorId":true,"keySetId":true,"iv":true,"aspect":true},"statement":{"body":"INSERT INTO posts (filename, author_id, key_set_id, iv, aspect) VALUES (:fileName, :authorId, :keySetId, :iv, :aspect) RETURNING id","loc":{"a":28,"b":158,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO posts (filename, author_id, key_set_id, iv, aspect) VALUES (:fileName, :authorId, :keySetId, :iv, :aspect) RETURNING id
 * ```
 */
export const createAndReturn = new PreparedQuery<ICreateAndReturnParams,ICreateAndReturnResult>(createAndReturnIR);


/** 'Publish' parameters type */
export interface IPublishParams {
  postId: number | null | void;
}

/** 'Publish' return type */
export type IPublishResult = void;

/** 'Publish' query type */
export interface IPublishQuery {
  params: IPublishParams;
  result: IPublishResult;
}

const publishIR: any = {"name":"Publish","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":229,"b":234,"line":5,"col":47}]}}],"usedParamSet":{"postId":true},"statement":{"body":"UPDATE posts SET published = NOW() WHERE id = :postId","loc":{"a":182,"b":234,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE posts SET published = NOW() WHERE id = :postId
 * ```
 */
export const publish = new PreparedQuery<IPublishParams,IPublishResult>(publishIR);


/** 'DestroyAndReturn' parameters type */
export interface IDestroyAndReturnParams {
  postId: number | null | void;
  authorId: number | null | void;
}

/** 'DestroyAndReturn' return type */
export interface IDestroyAndReturnResult {
  id: number;
  published: Date | null;
  authorId: number;
  filename: string;
  keySetId: number;
  iv: string;
  aspect: number;
  publishOrder: number | null;
}

/** 'DestroyAndReturn' query type */
export interface IDestroyAndReturnQuery {
  params: IDestroyAndReturnParams;
  result: IDestroyAndReturnResult;
}

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":297,"b":302,"line":8,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":321,"b":328,"line":8,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":267,"b":340,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *
 * ```
 */
export const destroyAndReturn = new PreparedQuery<IDestroyAndReturnParams,IDestroyAndReturnResult>(destroyAndReturnIR);


/** 'DestroyIfUnpublished' parameters type */
export interface IDestroyIfUnpublishedParams {
  postId: number | null | void;
}

/** 'DestroyIfUnpublished' return type */
export interface IDestroyIfUnpublishedResult {
  id: number;
  published: Date | null;
  authorId: number;
  filename: string;
  keySetId: number;
  iv: string;
  aspect: number;
  publishOrder: number | null;
}

/** 'DestroyIfUnpublished' query type */
export interface IDestroyIfUnpublishedQuery {
  params: IDestroyIfUnpublishedParams;
  result: IDestroyIfUnpublishedResult;
}

const destroyIfUnpublishedIR: any = {"name":"DestroyIfUnpublished","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":407,"b":412,"line":11,"col":30}]}}],"usedParamSet":{"postId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *","loc":{"a":377,"b":446,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *
 * ```
 */
export const destroyIfUnpublished = new PreparedQuery<IDestroyIfUnpublishedParams,IDestroyIfUnpublishedResult>(destroyIfUnpublishedIR);


/** 'GetHomePostsWithKeys' parameters type */
export interface IGetHomePostsWithKeysParams {
  userId: number | null | void;
  pageIndex: string | null | void;
}

/** 'GetHomePostsWithKeys' return type */
export interface IGetHomePostsWithKeysResult {
  id: number;
  published: Date | null;
  index: number | null;
  authorId: number;
  filename: string;
  iv: string;
  aspect: number;
  keySetId: number;
  key: string;
}

/** 'GetHomePostsWithKeys' query type */
export interface IGetHomePostsWithKeysQuery {
  params: IGetHomePostsWithKeysParams;
  result: IGetHomePostsWithKeysResult;
}

const getHomePostsWithKeysIR: any = {"name":"GetHomePostsWithKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":740,"b":745,"line":18,"col":20},{"a":771,"b":776,"line":19,"col":24},{"a":879,"b":884,"line":22,"col":35}]}},{"name":"pageIndex","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":895,"b":903,"line":24,"col":6},{"a":981,"b":989,"line":24,"col":92}]}}],"usedParamSet":{"userId":true,"pageIndex":true},"statement":{"body":"SELECT posts.id, posts.published, EXTRACT(EPOCH FROM posts.published)*1000000 AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,\n       keys.key\nFROM posts, keys\nWHERE posts.key_set_id = keys.key_set_id\nAND keys.user_id = :userId\nAND (posts.author_id = :userId OR posts.author_id IN (\n    SELECT followee_id\n    FROM followers\n    WHERE followers.follower_id = :userId\n))\nAND (:pageIndex::int8 IS NULL OR posts.published < (TIMESTAMP WITHOUT TIME ZONE 'epoch' + (:pageIndex::int8 / 1000000.0) * INTERVAL '1 second'))\nORDER BY posts.published DESC\nLIMIT 2","loc":{"a":483,"b":1070,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, EXTRACT(EPOCH FROM posts.published)*1000000 AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
 *        keys.key
 * FROM posts, keys
 * WHERE posts.key_set_id = keys.key_set_id
 * AND keys.user_id = :userId
 * AND (posts.author_id = :userId OR posts.author_id IN (
 *     SELECT followee_id
 *     FROM followers
 *     WHERE followers.follower_id = :userId
 * ))
 * AND (:pageIndex::int8 IS NULL OR posts.published < (TIMESTAMP WITHOUT TIME ZONE 'epoch' + (:pageIndex::int8 / 1000000.0) * INTERVAL '1 second'))
 * ORDER BY posts.published DESC
 * LIMIT 2
 * ```
 */
export const getHomePostsWithKeys = new PreparedQuery<IGetHomePostsWithKeysParams,IGetHomePostsWithKeysResult>(getHomePostsWithKeysIR);


/** 'GetUserPostsWithKeys' parameters type */
export interface IGetUserPostsWithKeysParams {
  requesterId: number | null | void;
  userId: number | null | void;
}

/** 'GetUserPostsWithKeys' return type */
export interface IGetUserPostsWithKeysResult {
  id: number;
  published: Date | null;
  index: number | null;
  authorId: number;
  filename: string;
  iv: string;
  aspect: number;
  keySetId: number;
  key: string;
}

/** 'GetUserPostsWithKeys' query type */
export interface IGetUserPostsWithKeysQuery {
  params: IGetUserPostsWithKeysParams;
  result: IGetUserPostsWithKeysResult;
}

const getUserPostsWithKeysIR: any = {"name":"GetUserPostsWithKeys","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1356,"b":1366,"line":33,"col":20}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1423,"b":1428,"line":35,"col":23}]}}],"usedParamSet":{"requesterId":true,"userId":true},"statement":{"body":"SELECT posts.id, posts.published, EXTRACT(EPOCH FROM posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,\n       keys.key\nFROM posts, keys\nWHERE posts.key_set_id = keys.key_set_id\nAND keys.user_id = :requesterId\nAND posts.published IS NOT NULL\nAND posts.author_id = :userId\nORDER BY published DESC","loc":{"a":1107,"b":1452,"line":29,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, EXTRACT(EPOCH FROM posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
 *        keys.key
 * FROM posts, keys
 * WHERE posts.key_set_id = keys.key_set_id
 * AND keys.user_id = :requesterId
 * AND posts.published IS NOT NULL
 * AND posts.author_id = :userId
 * ORDER BY published DESC
 * ```
 */
export const getUserPostsWithKeys = new PreparedQuery<IGetUserPostsWithKeysParams,IGetUserPostsWithKeysResult>(getUserPostsWithKeysIR);


/** 'GetPostWithKey' parameters type */
export interface IGetPostWithKeyParams {
  requesterId: number | null | void;
  postId: number | null | void;
}

/** 'GetPostWithKey' return type */
export interface IGetPostWithKeyResult {
  id: number;
  published: Date | null;
  index: number | null;
  authorId: number;
  filename: string;
  iv: string;
  aspect: number;
  keySetId: number;
  key: string;
}

/** 'GetPostWithKey' query type */
export interface IGetPostWithKeyQuery {
  params: IGetPostWithKeyParams;
  result: IGetPostWithKeyResult;
}

const getPostWithKeyIR: any = {"name":"GetPostWithKey","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1732,"b":1742,"line":43,"col":20}]}},{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1792,"b":1797,"line":45,"col":16}]}}],"usedParamSet":{"requesterId":true,"postId":true},"statement":{"body":"SELECT posts.id, posts.published, EXTRACT(EPOCH FROM posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,\n       keys.key\nFROM posts, keys\nWHERE posts.key_set_id = keys.key_set_id\nAND keys.user_id = :requesterId\nAND posts.published IS NOT NULL\nAND posts.id = :postId","loc":{"a":1483,"b":1797,"line":39,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, EXTRACT(EPOCH FROM posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
 *        keys.key
 * FROM posts, keys
 * WHERE posts.key_set_id = keys.key_set_id
 * AND keys.user_id = :requesterId
 * AND posts.published IS NOT NULL
 * AND posts.id = :postId
 * ```
 */
export const getPostWithKey = new PreparedQuery<IGetPostWithKeyParams,IGetPostWithKeyResult>(getPostWithKeyIR);


