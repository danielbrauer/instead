/** Types generated for queries found in "src/queries/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateAndReturn' parameters type */
export interface ICreateAndReturnParams {
  fileName: string | null | void;
  authorId: number | null | void;
  postKeySetId: number | null | void;
  iv: string | null | void;
  encryptedInfo: string | null | void;
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

const createAndReturnIR: any = {"name":"CreateAndReturn","params":[{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":114,"b":121,"line":2,"col":86}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":125,"b":132,"line":2,"col":97}]}},{"name":"postKeySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":136,"b":147,"line":2,"col":108}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":151,"b":152,"line":2,"col":123}]}},{"name":"encryptedInfo","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":156,"b":168,"line":2,"col":128}]}}],"usedParamSet":{"fileName":true,"authorId":true,"postKeySetId":true,"iv":true,"encryptedInfo":true},"statement":{"body":"INSERT INTO posts (filename, author_id, post_key_set_id, iv, encrypted_info) VALUES (:fileName, :authorId, :postKeySetId, :iv, :encryptedInfo) RETURNING id","loc":{"a":28,"b":182,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO posts (filename, author_id, post_key_set_id, iv, encrypted_info) VALUES (:fileName, :authorId, :postKeySetId, :iv, :encryptedInfo) RETURNING id
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

const publishIR: any = {"name":"Publish","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":253,"b":258,"line":5,"col":47}]}}],"usedParamSet":{"postId":true},"statement":{"body":"UPDATE posts SET published = NOW() WHERE id = :postId","loc":{"a":206,"b":258,"line":5,"col":0}}};

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
  aspect: number | null;
  encryptedInfo: string | null;
}

/** 'DestroyAndReturn' query type */
export interface IDestroyAndReturnQuery {
  params: IDestroyAndReturnParams;
  result: IDestroyAndReturnResult;
}

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":321,"b":326,"line":8,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":345,"b":352,"line":8,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":291,"b":364,"line":8,"col":0}}};

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
  aspect: number | null;
  encryptedInfo: string | null;
}

/** 'DestroyIfUnpublished' query type */
export interface IDestroyIfUnpublishedQuery {
  params: IDestroyIfUnpublishedParams;
  result: IDestroyIfUnpublishedResult;
}

const destroyIfUnpublishedIR: any = {"name":"DestroyIfUnpublished","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":431,"b":436,"line":11,"col":30}]}}],"usedParamSet":{"postId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND published IS NULL RETURNING *","loc":{"a":401,"b":470,"line":11,"col":0}}};

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
  encryptedInfo: string | null;
  aspect: number | null;
  postKeySetId: number;
  key: string;
}

/** 'GetHomePostsWithKeys' query type */
export interface IGetHomePostsWithKeysQuery {
  params: IGetHomePostsWithKeysParams;
  result: IGetHomePostsWithKeysResult;
}

const getHomePostsWithKeysIR: any = {"name":"GetHomePostsWithKeys","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":816,"b":826,"line":18,"col":30},{"a":852,"b":862,"line":19,"col":24},{"a":987,"b":997,"line":22,"col":46}]}},{"name":"pageIndex","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1040,"b":1048,"line":25,"col":6},{"a":1103,"b":1111,"line":25,"col":69}]}}],"usedParamSet":{"recipientId":true,"pageIndex":true},"statement":{"body":"SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,\n       post_keys.key\nFROM posts, post_keys\nWHERE posts.post_key_set_id = post_keys.post_key_set_id\nAND post_keys.recipient_id = :recipientId\nAND (posts.author_id = :recipientId OR posts.author_id IN (\n    SELECT followee_id\n    FROM follow_relationships\n    WHERE follow_relationships.follower_id = :recipientId\n))\nAND posts.published IS NOT NULL\nAND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))\nORDER BY posts.published DESC\nLIMIT 2","loc":{"a":507,"b":1157,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,
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
  encryptedInfo: string | null;
  aspect: number | null;
  postKeySetId: number;
  key: string;
}

/** 'GetUserPostsWithKeys' query type */
export interface IGetUserPostsWithKeysQuery {
  params: IGetUserPostsWithKeysParams;
  result: IGetUserPostsWithKeysResult;
}

const getUserPostsWithKeysIR: any = {"name":"GetUserPostsWithKeys","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1503,"b":1513,"line":34,"col":30}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1538,"b":1543,"line":35,"col":23}]}},{"name":"pageIndex","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1583,"b":1591,"line":37,"col":6},{"a":1646,"b":1654,"line":37,"col":69}]}}],"usedParamSet":{"recipientId":true,"userId":true,"pageIndex":true},"statement":{"body":"SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,\n       post_keys.key\nFROM posts, post_keys\nWHERE posts.post_key_set_id = post_keys.post_key_set_id\nAND post_keys.recipient_id = :recipientId\nAND posts.author_id = :userId\nAND posts.published IS NOT NULL\nAND (:pageIndex::int8 IS NULL OR posts.published < int_to_timestamp(:pageIndex::int8))\nORDER BY posts.published DESC\nLIMIT 2","loc":{"a":1194,"b":1700,"line":30,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,
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
  encryptedInfo: string | null;
  aspect: number | null;
  postKeySetId: number;
  key: string;
}

/** 'GetPostWithKey' query type */
export interface IGetPostWithKeyQuery {
  params: IGetPostWithKeyParams;
  result: IGetPostWithKeyResult;
}

const getPostWithKeyIR: any = {"name":"GetPostWithKey","params":[{"name":"recipientId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2040,"b":2050,"line":46,"col":30}]}},{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2100,"b":2105,"line":48,"col":16}]}}],"usedParamSet":{"recipientId":true,"postId":true},"statement":{"body":"SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,\n       post_keys.key\nFROM posts, post_keys\nWHERE posts.post_key_set_id = post_keys.post_key_set_id\nAND post_keys.recipient_id = :recipientId\nAND posts.published IS NOT NULL\nAND posts.id = :postId","loc":{"a":1731,"b":2105,"line":42,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.published, timestamp_to_int(posts.published) AS index, posts.author_id, posts.filename, posts.iv, posts.encrypted_info, posts.aspect, posts.post_key_set_id,
 *        post_keys.key
 * FROM posts, post_keys
 * WHERE posts.post_key_set_id = post_keys.post_key_set_id
 * AND post_keys.recipient_id = :recipientId
 * AND posts.published IS NOT NULL
 * AND posts.id = :postId
 * ```
 */
export const getPostWithKey = new PreparedQuery<IGetPostWithKeyParams,IGetPostWithKeyResult>(getPostWithKeyIR);


