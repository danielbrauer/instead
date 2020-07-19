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

const publishIR: any = {"name":"Publish","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":228,"b":233,"line":5,"col":46}]}}],"usedParamSet":{"postId":true},"statement":{"body":"UPDATE posts SET published = true WHERE id = :postId","loc":{"a":182,"b":233,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE posts SET published = true WHERE id = :postId
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
  timestamp: Date;
  author_id: number;
  filename: string;
  published: boolean;
  key_set_id: number;
  iv: string;
  aspect: number;
}

/** 'DestroyAndReturn' query type */
export interface IDestroyAndReturnQuery {
  params: IDestroyAndReturnParams;
  result: IDestroyAndReturnResult;
}

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":296,"b":301,"line":8,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":320,"b":327,"line":8,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":266,"b":339,"line":8,"col":0}}};

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
  timestamp: Date;
  author_id: number;
  filename: string;
  published: boolean;
  key_set_id: number;
  iv: string;
  aspect: number;
}

/** 'DestroyIfUnpublished' query type */
export interface IDestroyIfUnpublishedQuery {
  params: IDestroyIfUnpublishedParams;
  result: IDestroyIfUnpublishedResult;
}

const destroyIfUnpublishedIR: any = {"name":"DestroyIfUnpublished","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":406,"b":411,"line":11,"col":30}]}}],"usedParamSet":{"postId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND published = false RETURNING *","loc":{"a":376,"b":445,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM posts WHERE id = :postId AND published = false RETURNING *
 * ```
 */
export const destroyIfUnpublished = new PreparedQuery<IDestroyIfUnpublishedParams,IDestroyIfUnpublishedResult>(destroyIfUnpublishedIR);


/** 'GetHomePostsWithKeys' parameters type */
export interface IGetHomePostsWithKeysParams {
  authorId: number | null | void;
}

/** 'GetHomePostsWithKeys' return type */
export interface IGetHomePostsWithKeysResult {
  id: number;
  timestamp: Date;
  author_id: number;
  filename: string;
  iv: string;
  aspect: number;
  jwk: string;
}

/** 'GetHomePostsWithKeys' query type */
export interface IGetHomePostsWithKeysQuery {
  params: IGetHomePostsWithKeysParams;
  result: IGetHomePostsWithKeysResult;
}

const getHomePostsWithKeysIR: any = {"name":"GetHomePostsWithKeys","params":[{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":667,"b":674,"line":18,"col":20},{"a":727,"b":734,"line":20,"col":24},{"a":837,"b":844,"line":23,"col":35}]}}],"usedParamSet":{"authorId":true},"statement":{"body":"SELECT posts.id, posts.timestamp, posts.author_id, posts.filename, posts.iv, posts.aspect,\n       keys.jwk\nFROM posts, keys\nWHERE posts.key_set_id = keys.key_set_id\nAND keys.user_id = :authorId\nAND posts.published = true\nAND (posts.author_id = :authorId OR posts.author_id IN (\n    SELECT followee_id\n    FROM followers\n    WHERE followers.follower_id = :authorId\n)) ORDER BY timestamp DESC","loc":{"a":482,"b":871,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT posts.id, posts.timestamp, posts.author_id, posts.filename, posts.iv, posts.aspect,
 *        keys.jwk
 * FROM posts, keys
 * WHERE posts.key_set_id = keys.key_set_id
 * AND keys.user_id = :authorId
 * AND posts.published = true
 * AND (posts.author_id = :authorId OR posts.author_id IN (
 *     SELECT followee_id
 *     FROM followers
 *     WHERE followers.follower_id = :authorId
 * )) ORDER BY timestamp DESC
 * ```
 */
export const getHomePostsWithKeys = new PreparedQuery<IGetHomePostsWithKeysParams,IGetHomePostsWithKeysResult>(getHomePostsWithKeysIR);


