/** Types generated for queries found in "src/queries/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateAndReturn' parameters type */
export interface ICreateAndReturnParams {
  fileName: string | null | void;
  authorId: number | null | void;
  keySetId: number | null | void;
  iv: string | null | void;
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

const createAndReturnIR: any = {"name":"CreateAndReturn","params":[{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":93,"b":100,"line":2,"col":65}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":104,"b":111,"line":2,"col":76}]}},{"name":"keySetId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":115,"b":122,"line":2,"col":87}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":126,"b":127,"line":2,"col":98}]}}],"usedParamSet":{"fileName":true,"authorId":true,"keySetId":true,"iv":true},"statement":{"body":"INSERT INTO posts (filename, author_id, key_set_id, iv) VALUES (:fileName, :authorId, :keySetId, :iv) RETURNING id","loc":{"a":28,"b":141,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO posts (filename, author_id, key_set_id, iv) VALUES (:fileName, :authorId, :keySetId, :iv) RETURNING id
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

const publishIR: any = {"name":"Publish","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":211,"b":216,"line":5,"col":46}]}}],"usedParamSet":{"postId":true},"statement":{"body":"UPDATE posts SET published = true WHERE id = :postId","loc":{"a":165,"b":216,"line":5,"col":0}}};

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
}

/** 'DestroyAndReturn' query type */
export interface IDestroyAndReturnQuery {
  params: IDestroyAndReturnParams;
  result: IDestroyAndReturnResult;
}

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":279,"b":284,"line":8,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":303,"b":310,"line":8,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":249,"b":322,"line":8,"col":0}}};

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
}

/** 'DestroyIfUnpublished' query type */
export interface IDestroyIfUnpublishedQuery {
  params: IDestroyIfUnpublishedParams;
  result: IDestroyIfUnpublishedResult;
}

const destroyIfUnpublishedIR: any = {"name":"DestroyIfUnpublished","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":389,"b":394,"line":11,"col":30}]}}],"usedParamSet":{"postId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND published = false RETURNING *","loc":{"a":359,"b":428,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM posts WHERE id = :postId AND published = false RETURNING *
 * ```
 */
export const destroyIfUnpublished = new PreparedQuery<IDestroyIfUnpublishedParams,IDestroyIfUnpublishedResult>(destroyIfUnpublishedIR);


/** 'GetByAuthorId' parameters type */
export interface IGetByAuthorIdParams {
  authorId: number | null | void;
}

/** 'GetByAuthorId' return type */
export interface IGetByAuthorIdResult {
  id: number;
  timestamp: Date;
  author_id: number;
  filename: string;
  published: boolean;
  key_set_id: number;
  iv: string;
}

/** 'GetByAuthorId' query type */
export interface IGetByAuthorIdQuery {
  params: IGetByAuthorIdParams;
  result: IGetByAuthorIdResult;
}

const getByAuthorIdIR: any = {"name":"GetByAuthorId","params":[{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":519,"b":526,"line":14,"col":61},{"a":623,"b":630,"line":17,"col":35}]}}],"usedParamSet":{"authorId":true},"statement":{"body":"SELECT * FROM posts WHERE published = true AND (author_id = :authorId OR author_id IN (\n    SELECT followee_id\n    FROM followers\n    WHERE followers.follower_id = :authorId\n)) ORDER BY timestamp DESC","loc":{"a":458,"b":657,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM posts WHERE published = true AND (author_id = :authorId OR author_id IN (
 *     SELECT followee_id
 *     FROM followers
 *     WHERE followers.follower_id = :authorId
 * )) ORDER BY timestamp DESC
 * ```
 */
export const getByAuthorId = new PreparedQuery<IGetByAuthorIdParams,IGetByAuthorIdResult>(getByAuthorIdIR);


