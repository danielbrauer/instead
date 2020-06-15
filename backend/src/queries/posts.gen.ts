/** Types generated for queries found in "src/queries/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'Create' parameters type */
export interface ICreateParams {
  fileName: string | null | void;
  authorId: number | null | void;
  iv: string | null | void;
  key: Json | null | void;
}

/** 'Create' return type */
export type ICreateResult = void;

/** 'Create' query type */
export interface ICreateQuery {
  params: ICreateParams;
  result: ICreateResult;
}

const createIR: any = {"name":"Create","params":[{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":77,"b":84,"line":2,"col":58}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":88,"b":95,"line":2,"col":69}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":99,"b":100,"line":2,"col":80}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":104,"b":106,"line":2,"col":85}]}}],"usedParamSet":{"fileName":true,"authorId":true,"iv":true,"key":true},"statement":{"body":"INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key)","loc":{"a":19,"b":107,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key)
 * ```
 */
export const create = new PreparedQuery<ICreateParams,ICreateResult>(createIR);


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

const destroyAndReturnIR: any = {"name":"DestroyAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":170,"b":175,"line":5,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":194,"b":201,"line":5,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":140,"b":213,"line":5,"col":0}}};

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

const getByAuthorIdIR: any = {"name":"GetByAuthorId","params":[{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":282,"b":289,"line":8,"col":39},{"a":386,"b":393,"line":11,"col":35}]}}],"usedParamSet":{"authorId":true},"statement":{"body":"SELECT * FROM posts WHERE author_id = :authorId OR author_id IN (\n    SELECT followee_id\n    FROM followers\n    WHERE followers.follower_id = :authorId\n) ORDER BY timestamp DESC","loc":{"a":243,"b":419,"line":8,"col":0}}};

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


