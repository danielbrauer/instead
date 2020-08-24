/** Types generated for queries found in "src/queries/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateAndReturn' parameters type */
export interface ICreateAndReturnParams {
  fileName: string | null | void;
  authorId: number | null | void;
  postKeySetId: number | null | void;
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

const createAndReturnIR: any = {"name":"CreateAndReturn","params":[{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":106,"b":113,"line":2,"col":78}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":117,"b":124,"line":2,"col":89}]}},{"name":"postKeySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":128,"b":139,"line":2,"col":100}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":143,"b":144,"line":2,"col":115}]}},{"name":"aspect","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":148,"b":153,"line":2,"col":120}]}}],"usedParamSet":{"fileName":true,"authorId":true,"postKeySetId":true,"iv":true,"aspect":true},"statement":{"body":"INSERT INTO posts (filename, author_id, post_key_set_id, iv, aspect) VALUES (:fileName, :authorId, :postKeySetId, :iv, :aspect) RETURNING id","loc":{"a":28,"b":167,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO posts (filename, author_id, post_key_set_id, iv, aspect) VALUES (:fileName, :authorId, :postKeySetId, :iv, :aspect) RETURNING id
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

const publishIR: any = {"name":"Publish","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":238,"b":243,"line":5,"col":47}]}}],"usedParamSet":{"postId":true},"statement":{"body":"UPDATE posts SET published = NOW() WHERE id = :postId","loc":{"a":191,"b":243,"line":5,"col":0}}};

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
  postKeySetId: number;
  iv: string;
  aspect: number;
}

/** 'DestroyAndReturn' query type */
export interface IDestroyAndReturnQuery {
  params: IDestroyAndReturnParams;
  result: IDestroyAndReturnResult;
}

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":306,"b":311,"line":8,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":330,"b":337,"line":8,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":276,"b":349,"line":8,"col":0}}};

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
  postKeySetId: number;
  iv: string;
  aspect: number;
}

/** 'DestroyIfUnpublished' query type */
export interface IDestroyIfUnpublishedQuery {
  params: IDestroyIfUnpublishedParams;
  result: IDestroyIfUnpublishedResult;
}

const destroyIfUnpublishedIR: any = {"name":"DestroyIfUnpublished","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":416,"b":421,"line":11,"col":30}]}}],"usedParamSet":{"postId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *","loc":{"a":386,"b":455,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *
 * ```
 */
export const destroyIfUnpublished = new PreparedQuery<IDestroyIfUnpublishedParams,IDestroyIfUnpublishedResult>(destroyIfUnpublishedIR);


/** 'GetHomePostsWithKeys' parameters type */
export interface IGetHomePostsWithKeysParams {
  recipientId: number | null | void;
  pageIndex: string | null | void;
}

/** 'GetHomePostsWithKeys' return type */
export interface IGetHomePostsWithKeysResult {
  id: number;
  published: Date | null;
  index: string | null;
  authorId: number;
  filename: string;
  iv: string;
  aspect: number;
  postKeySetId: number;
  key: string;
}

/** 'GetHomePostsWithKeys' query type */
export interface IGetHomePostsWithKeysQuery {
  params: IGetHomePostsWithKeysParams;
  result: IGetHomePostsWithKeysResult;
}

const getHomePostsWithKeysIR: any = {"name":"GetHomePostsWithKeys","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":779,"b":789,"line":18,"col":30},{"a":815,"b":825,"line":19,"col":24},{"a":950,"b":960,"line":22,"col":46}]}},{"name":"pageIndex","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1003,"b":1011,"line":25,"col":6},{"a":1066,"b":1074,"line":25,"col":69}]}}],"usedParamSet":{"recipientId":true,"pageIndex":true},"statement":{"body":"SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.post_key_set_id,\n       post_keys.key\nFROM posts, post_keys\nWHERE posts.post_key_set_id = post_keys.post_key_set_id\nAND post_keys.recipient_id = :recipientId\nAND (posts.author_id = :recipientId OR posts.author_id IN (\n    SELECT followee_id\n    FROM follow_relationships\n    WHERE follow_relationships.follower_id = :recipientId\n))\nAND posts.published IS NOT NULL\nAND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))\nORDER BY posts.published DESC\nLIMIT 2","loc":{"a":492,"b":1120,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.post_key_set_id,
 *        post_keys.key
 * FROM posts, post_keys
 * WHERE posts.post_key_set_id = post_keys.post_key_set_id
 * AND post_keys.recipient_id = :recipientId
 * AND (posts.author_id = :recipientId OR posts.author_id IN (
 *     SELECT followee_id
 *     FROM follow_relationships
 *     WHERE follow_relationships.follower_id = :recipientId
 * ))
 * AND posts.published IS NOT NULL
 * AND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))
 * ORDER BY posts.published DESC
 * LIMIT 2
 * ```
 */
export const getHomePostsWithKeys = new PreparedQuery<IGetHomePostsWithKeysParams,IGetHomePostsWithKeysResult>(getHomePostsWithKeysIR);


/** 'GetUserPostsWithKeys' parameters type */
export interface IGetUserPostsWithKeysParams {
  recipientId: number | null | void;
  userId: number | null | void;
  pageIndex: string | null | void;
}

/** 'GetUserPostsWithKeys' return type */
export interface IGetUserPostsWithKeysResult {
  id: number;
  published: Date | null;
  index: string | null;
  authorId: number;
  filename: string;
  iv: string;
  aspect: number;
  postKeySetId: number;
  key: string;
}

/** 'GetUserPostsWithKeys' query type */
export interface IGetUserPostsWithKeysQuery {
  params: IGetUserPostsWithKeysParams;
  result: IGetUserPostsWithKeysResult;
}

const getUserPostsWithKeysIR: any = {"name":"GetUserPostsWithKeys","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1444,"b":1454,"line":34,"col":30}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1479,"b":1484,"line":35,"col":23}]}},{"name":"pageIndex","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1524,"b":1532,"line":37,"col":6},{"a":1587,"b":1595,"line":37,"col":69}]}}],"usedParamSet":{"recipientId":true,"userId":true,"pageIndex":true},"statement":{"body":"SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.post_key_set_id,\n       post_keys.key\nFROM posts, post_keys\nWHERE posts.post_key_set_id = post_keys.post_key_set_id\nAND post_keys.recipient_id = :recipientId\nAND posts.author_id = :userId\nAND posts.published IS NOT NULL\nAND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))\nORDER BY posts.published DESC\nLIMIT 2","loc":{"a":1157,"b":1641,"line":30,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.post_key_set_id,
 *        post_keys.key
 * FROM posts, post_keys
 * WHERE posts.post_key_set_id = post_keys.post_key_set_id
 * AND post_keys.recipient_id = :recipientId
 * AND posts.author_id = :userId
 * AND posts.published IS NOT NULL
 * AND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))
 * ORDER BY posts.published DESC
 * LIMIT 2
 * ```
 */
export const getUserPostsWithKeys = new PreparedQuery<IGetUserPostsWithKeysParams,IGetUserPostsWithKeysResult>(getUserPostsWithKeysIR);


/** 'GetPostWithKey' parameters type */
export interface IGetPostWithKeyParams {
  recipientId: number | null | void;
  postId: number | null | void;
}

/** 'GetPostWithKey' return type */
export interface IGetPostWithKeyResult {
  id: number;
  published: Date | null;
  index: string | null;
  authorId: number;
  filename: string;
  iv: string;
  aspect: number;
  postKeySetId: number;
  key: string;
}

/** 'GetPostWithKey' query type */
export interface IGetPostWithKeyQuery {
  params: IGetPostWithKeyParams;
  result: IGetPostWithKeyResult;
}

const getPostWithKeyIR: any = {"name":"GetPostWithKey","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1959,"b":1969,"line":46,"col":30}]}},{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2019,"b":2024,"line":48,"col":16}]}}],"usedParamSet":{"recipientId":true,"postId":true},"statement":{"body":"SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.post_key_set_id,\n       post_keys.key\nFROM posts, post_keys\nWHERE posts.post_key_set_id = post_keys.post_key_set_id\nAND post_keys.recipient_id = :recipientId\nAND posts.published IS NOT NULL\nAND posts.id = :postId","loc":{"a":1672,"b":2024,"line":42,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.aspect, posts.post_key_set_id,
 *        post_keys.key
 * FROM posts, post_keys
 * WHERE posts.post_key_set_id = post_keys.post_key_set_id
 * AND post_keys.recipient_id = :recipientId
 * AND posts.published IS NOT NULL
 * AND posts.id = :postId
 * ```
 */
export const getPostWithKey = new PreparedQuery<IGetPostWithKeyParams,IGetPostWithKeyResult>(getPostWithKeyIR);


