/** Types generated for queries found in "src/queries/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'CreateAndReturn' parameters type */
export interface ICreateAndReturnParams {
  fileName: string | null | void;
  authorId: number | null | void;
  iv: string | null | void;
  key: Json | null | void;
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

const createAndReturnIR: any = {"name":"CreateAndReturn","params":[{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":86,"b":93,"line":2,"col":58}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":97,"b":104,"line":2,"col":69}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":108,"b":109,"line":2,"col":80}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":113,"b":115,"line":2,"col":85}]}}],"usedParamSet":{"fileName":true,"authorId":true,"iv":true,"key":true},"statement":{"body":"INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key) RETURNING id","loc":{"a":28,"b":129,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key) RETURNING id
 * ```
 */
export const createAndReturn = new PreparedQuery<ICreateAndReturnParams,ICreateAndReturnResult>(createAndReturnIR);


/** 'DestroyAndReturn' parameters type */
export interface IDestroyAndReturnParams {
  postId: number | null | void;
  authorId: number | null | void;
}

/** 'DestroyAndReturn' return type */
export interface IDestroyAndReturnResult {
  id: number;
  timestamp: Date;
  key: Json;
  iv: string;
  author_id: number;
  filename: string;
}

/** 'DestroyAndReturn' query type */
export interface IDestroyAndReturnQuery {
  params: IDestroyAndReturnParams;
  result: IDestroyAndReturnResult;
}

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":192,"b":197,"line":5,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":216,"b":223,"line":5,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":162,"b":235,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *
 * ```
 */
export const destroyAndReturn = new PreparedQuery<IDestroyAndReturnParams,IDestroyAndReturnResult>(destroyAndReturnIR);


/** 'GetByAuthorId' parameters type */
export interface IGetByAuthorIdParams {
  authorId: number | null | void;
}

/** 'GetByAuthorId' return type */
export interface IGetByAuthorIdResult {
  id: number;
  timestamp: Date;
  key: Json;
  iv: string;
  author_id: number;
  filename: string;
}

/** 'GetByAuthorId' query type */
export interface IGetByAuthorIdQuery {
  params: IGetByAuthorIdParams;
  result: IGetByAuthorIdResult;
}

const getByAuthorIdIR: any = {"name":"GetByAuthorId","params":[{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":304,"b":311,"line":8,"col":39},{"a":408,"b":415,"line":11,"col":35}]}}],"usedParamSet":{"authorId":true},"statement":{"body":"SELECT * FROM posts WHERE author_id = :authorId OR author_id IN (\n    SELECT followee_id\n    FROM followers\n    WHERE followers.follower_id = :authorId\n) ORDER BY timestamp DESC","loc":{"a":265,"b":441,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM posts WHERE author_id = :authorId OR author_id IN (
 *     SELECT followee_id
 *     FROM followers
 *     WHERE followers.follower_id = :authorId
 * ) ORDER BY timestamp DESC
 * ```
 */
export const getByAuthorId = new PreparedQuery<IGetByAuthorIdParams,IGetByAuthorIdResult>(getByAuthorIdIR);


