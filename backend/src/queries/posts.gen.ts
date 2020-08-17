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

const publishIR: any = {"name":"Publish","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":277,"b":282,"line":5,"col":95}]}}],"usedParamSet":{"postId":true},"statement":{"body":"UPDATE posts SET published = NOW(), publish_order = nextval('posts_published_seq') WHERE id = :postId","loc":{"a":182,"b":282,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE posts SET published = NOW(), publish_order = nextval('posts_published_seq') WHERE id = :postId
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

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":345,"b":350,"line":8,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":369,"b":376,"line":8,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":315,"b":388,"line":8,"col":0}}};

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

const destroyIfUnpublishedIR: any = {"name":"DestroyIfUnpublished","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":455,"b":460,"line":11,"col":30}]}}],"usedParamSet":{"postId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *","loc":{"a":425,"b":494,"line":11,"col":0}}};

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
  beforePublishOrder: number | null | void;
}

/** 'GetHomePostsWithKeys' return type */
export interface IGetHomePostsWithKeysResult {
  id: number;
  published: Date | null;
  publishOrder: number | null;
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

const getHomePostsWithKeysIR: any = {"name":"GetHomePostsWithKeys","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":755,"b":760,"line":18,"col":20},{"a":786,"b":791,"line":19,"col":24},{"a":894,"b":899,"line":22,"col":35}]}},{"name":"beforePublishOrder","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":931,"b":948,"line":24,"col":27}]}}],"usedParamSet":{"userId":true,"beforePublishOrder":true},"statement":{"body":"SELECT posts.id, posts.published, posts.publish_order, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,\n       keys.key\nFROM posts, keys\nWHERE posts.key_set_id = keys.key_set_id\nAND keys.user_id = :userId\nAND (posts.author_id = :userId OR posts.author_id IN (\n    SELECT followee_id\n    FROM followers\n    WHERE followers.follower_id = :userId\n))\nAND posts.publish_order < :beforePublishOrder\nORDER BY posts.publish_order DESC\nLIMIT 2","loc":{"a":531,"b":990,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, posts.publish_order, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
 *        keys.key
 * FROM posts, keys
 * WHERE posts.key_set_id = keys.key_set_id
 * AND keys.user_id = :userId
 * AND (posts.author_id = :userId OR posts.author_id IN (
 *     SELECT followee_id
 *     FROM followers
 *     WHERE followers.follower_id = :userId
 * ))
 * AND posts.publish_order < :beforePublishOrder
 * ORDER BY posts.publish_order DESC
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
  publishOrder: number | null;
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

const getUserPostsWithKeysIR: any = {"name":"GetUserPostsWithKeys","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1251,"b":1261,"line":33,"col":20}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1318,"b":1323,"line":35,"col":23}]}}],"usedParamSet":{"requesterId":true,"userId":true},"statement":{"body":"SELECT posts.id, posts.published, posts.publish_order, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,\n       keys.key\nFROM posts, keys\nWHERE posts.key_set_id = keys.key_set_id\nAND keys.user_id = :requesterId\nAND posts.published IS NOT NULL\nAND posts.author_id = :userId\nORDER BY published DESC","loc":{"a":1027,"b":1347,"line":29,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, posts.publish_order, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
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
  publishOrder: number | null;
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

const getPostWithKeyIR: any = {"name":"GetPostWithKey","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1602,"b":1612,"line":43,"col":20}]}},{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1662,"b":1667,"line":45,"col":16}]}}],"usedParamSet":{"requesterId":true,"postId":true},"statement":{"body":"SELECT posts.id, posts.published, posts.publish_order, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,\n       keys.key\nFROM posts, keys\nWHERE posts.key_set_id = keys.key_set_id\nAND keys.user_id = :requesterId\nAND posts.published IS NOT NULL\nAND posts.id = :postId","loc":{"a":1378,"b":1667,"line":39,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, posts.publish_order, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.key_set_id,
 *        keys.key
 * FROM posts, keys
 * WHERE posts.key_set_id = keys.key_set_id
 * AND keys.user_id = :requesterId
 * AND posts.published IS NOT NULL
 * AND posts.id = :postId
 * ```
 */
export const getPostWithKey = new PreparedQuery<IGetPostWithKeyParams,IGetPostWithKeyResult>(getPostWithKeyIR);


