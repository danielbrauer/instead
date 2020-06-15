/** Types generated for queries found in "src/queries/queries.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'FindUserById' parameters type */
export interface IFindUserByIdParams {
  userId: number | null | void;
}

/** 'FindUserById' return type */
export interface IFindUserByIdResult {
  id: number;
  username: string;
}

/** 'FindUserById' query type */
export interface IFindUserByIdQuery {
  params: IFindUserByIdParams;
  result: IFindUserByIdResult;
}

const findUserByIdIR: any = {"name":"FindUserById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":68,"b":73,"line":2,"col":43}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, username FROM users WHERE id = :userId","loc":{"a":25,"b":73,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username FROM users WHERE id = :userId
 * ```
 */
export const findUserById = new PreparedQuery<IFindUserByIdParams,IFindUserByIdResult>(findUserByIdIR);


/** 'FindUserByName' parameters type */
export interface IFindUserByNameParams {
  username: string | null | void;
}

/** 'FindUserByName' return type */
export interface IFindUserByNameResult {
  id: number;
}

/** 'FindUserByName' query type */
export interface IFindUserByNameQuery {
  params: IFindUserByNameParams;
  result: IFindUserByNameResult;
}

const findUserByNameIR: any = {"name":"FindUserByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":143,"b":150,"line":5,"col":39}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id FROM users WHERE username = :username","loc":{"a":104,"b":150,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM users WHERE username = :username
 * ```
 */
export const findUserByName = new PreparedQuery<IFindUserByNameParams,IFindUserByNameResult>(findUserByNameIR);


/** 'CountUsersByName' parameters type */
export interface ICountUsersByNameParams {
  username: string | null | void;
}

/** 'CountUsersByName' return type */
export interface ICountUsersByNameResult {
  count: number;
}

/** 'CountUsersByName' query type */
export interface ICountUsersByNameQuery {
  params: ICountUsersByNameParams;
  result: ICountUsersByNameResult;
}

const countUsersByNameIR: any = {"name":"CountUsersByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":228,"b":235,"line":8,"col":45}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT COUNT(*) FROM users WHERE username = :username","loc":{"a":183,"b":235,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) FROM users WHERE username = :username
 * ```
 */
export const countUsersByName = new PreparedQuery<ICountUsersByNameParams,ICountUsersByNameResult>(countUsersByNameIR);


/** 'GetUserLoginInfoByName' parameters type */
export interface IGetUserLoginInfoByNameParams {
  username: string | null | void;
}

/** 'GetUserLoginInfoByName' return type */
export interface IGetUserLoginInfoByNameResult {
  id: number;
  username: string;
  srp_salt: string;
  verifier: string;
  display_name: string;
}

/** 'GetUserLoginInfoByName' query type */
export interface IGetUserLoginInfoByNameQuery {
  params: IGetUserLoginInfoByNameParams;
  result: IGetUserLoginInfoByNameResult;
}

const getUserLoginInfoByNameIR: any = {"name":"GetUserLoginInfoByName","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":357,"b":364,"line":11,"col":83}]}}],"usedParamSet":{"username":true},"statement":{"body":"SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username","loc":{"a":274,"b":364,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, username, srp_salt, verifier, display_name FROM users WHERE username = :username
 * ```
 */
export const getUserLoginInfoByName = new PreparedQuery<IGetUserLoginInfoByNameParams,IGetUserLoginInfoByNameResult>(getUserLoginInfoByNameIR);


/** 'CreateUser' parameters type */
export interface ICreateUserParams {
  username: string | null | void;
  display_name: string | null | void;
  verifier: string | null | void;
  srp_salt: string | null | void;
  muk_salt: string | null | void;
  public_key: Json | null | void;
  private_key: string | null | void;
  private_key_iv: string | null | void;
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
  id: number;
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
  params: ICreateUserParams;
  result: ICreateUserResult;
}

const createUserIR: any = {"name":"CreateUser","params":[{"name":"username","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":514,"b":521,"line":14,"col":123}]}},{"name":"display_name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":525,"b":536,"line":14,"col":134}]}},{"name":"verifier","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":540,"b":547,"line":14,"col":149}]}},{"name":"srp_salt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":551,"b":558,"line":14,"col":160}]}},{"name":"muk_salt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":562,"b":569,"line":14,"col":171}]}},{"name":"public_key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":573,"b":582,"line":14,"col":182}]}},{"name":"private_key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":586,"b":596,"line":14,"col":195}]}},{"name":"private_key_iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":600,"b":613,"line":14,"col":209}]}}],"usedParamSet":{"username":true,"display_name":true,"verifier":true,"srp_salt":true,"muk_salt":true,"public_key":true,"private_key":true,"private_key_iv":true},"statement":{"body":"INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key, :private_key_iv) RETURNING id","loc":{"a":391,"b":627,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, display_name, verifier, srp_salt, muk_salt, public_key, private_key, private_key_iv) VALUES (:username, :display_name, :verifier, :srp_salt, :muk_salt, :public_key, :private_key, :private_key_iv) RETURNING id
 * ```
 */
export const createUser = new PreparedQuery<ICreateUserParams,ICreateUserResult>(createUserIR);


/** 'CountFollowersById' parameters type */
export interface ICountFollowersByIdParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'CountFollowersById' return type */
export interface ICountFollowersByIdResult {
  count: number;
}

/** 'CountFollowersById' query type */
export interface ICountFollowersByIdQuery {
  params: ICountFollowersByIdParams;
  result: ICountFollowersByIdResult;
}

const countFollowersByIdIR: any = {"name":"CountFollowersById","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":714,"b":723,"line":17,"col":52}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":744,"b":753,"line":17,"col":82}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"SELECT COUNT(*) FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":662,"b":753,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId
 * ```
 */
export const countFollowersById = new PreparedQuery<ICountFollowersByIdParams,ICountFollowersByIdResult>(countFollowersByIdIR);


/** 'CountFollowRequestsById' parameters type */
export interface ICountFollowRequestsByIdParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'CountFollowRequestsById' return type */
export interface ICountFollowRequestsByIdResult {
  count: number;
}

/** 'CountFollowRequestsById' query type */
export interface ICountFollowRequestsByIdQuery {
  params: ICountFollowRequestsByIdParams;
  result: ICountFollowRequestsByIdResult;
}

const countFollowRequestsByIdIR: any = {"name":"CountFollowRequestsById","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":852,"b":862,"line":20,"col":59}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":884,"b":894,"line":20,"col":91}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"SELECT COUNT(*) FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId","loc":{"a":793,"b":894,"line":20,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId
 * ```
 */
export const countFollowRequestsById = new PreparedQuery<ICountFollowRequestsByIdParams,ICountFollowRequestsByIdResult>(countFollowRequestsByIdIR);


/** 'InsertFollowRequest' parameters type */
export interface IInsertFollowRequestParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'InsertFollowRequest' return type */
export type IInsertFollowRequestResult = void;

/** 'InsertFollowRequest' query type */
export interface IInsertFollowRequestQuery {
  params: IInsertFollowRequestParams;
  result: IInsertFollowRequestResult;
}

const insertFollowRequestIR: any = {"name":"InsertFollowRequest","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":996,"b":1006,"line":23,"col":66}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1010,"b":1020,"line":23,"col":80}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"INSERT INTO follow_requests (requester_id, requestee_id) VALUES (:requesterId, :requesteeId)","loc":{"a":930,"b":1021,"line":23,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO follow_requests (requester_id, requestee_id) VALUES (:requesterId, :requesteeId)
 * ```
 */
export const insertFollowRequest = new PreparedQuery<IInsertFollowRequestParams,IInsertFollowRequestResult>(insertFollowRequestIR);


/** 'CreatePost' parameters type */
export interface ICreatePostParams {
  fileName: string | null | void;
  authorId: number | null | void;
  iv: string | null | void;
  key: Json | null | void;
}

/** 'CreatePost' return type */
export type ICreatePostResult = void;

/** 'CreatePost' query type */
export interface ICreatePostQuery {
  params: ICreatePostParams;
  result: ICreatePostResult;
}

const createPostIR: any = {"name":"CreatePost","params":[{"name":"fileName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1106,"b":1113,"line":26,"col":58}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1117,"b":1124,"line":26,"col":69}]}},{"name":"iv","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1128,"b":1129,"line":26,"col":80}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1133,"b":1135,"line":26,"col":85}]}}],"usedParamSet":{"fileName":true,"authorId":true,"iv":true,"key":true},"statement":{"body":"INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key)","loc":{"a":1048,"b":1136,"line":26,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO posts (filename, author_id, iv, key) VALUES (:fileName, :authorId, :iv, :key)
 * ```
 */
export const createPost = new PreparedQuery<ICreatePostParams,ICreatePostResult>(createPostIR);


/** 'GetPostsByAuthorId' parameters type */
export interface IGetPostsByAuthorIdParams {
  authorId: number | null | void;
}

/** 'GetPostsByAuthorId' return type */
export interface IGetPostsByAuthorIdResult {
  id: number;
  timestamp: Date;
  key: Json;
  iv: string;
  author_id: number;
  filename: string;
}

/** 'GetPostsByAuthorId' query type */
export interface IGetPostsByAuthorIdQuery {
  params: IGetPostsByAuthorIdParams;
  result: IGetPostsByAuthorIdResult;
}

const getPostsByAuthorIdIR: any = {"name":"GetPostsByAuthorId","params":[{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1210,"b":1217,"line":29,"col":39},{"a":1314,"b":1321,"line":32,"col":35}]}}],"usedParamSet":{"authorId":true},"statement":{"body":"SELECT * FROM posts WHERE author_id = :authorId OR author_id IN (\n    SELECT followee_id\n    FROM followers\n    WHERE followers.follower_id = :authorId\n) ORDER BY timestamp DESC","loc":{"a":1171,"b":1347,"line":29,"col":0}}};

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
export const getPostsByAuthorId = new PreparedQuery<IGetPostsByAuthorIdParams,IGetPostsByAuthorIdResult>(getPostsByAuthorIdIR);


/** 'DeletePostAndReturn' parameters type */
export interface IDeletePostAndReturnParams {
  postId: number | null | void;
  authorId: number | null | void;
}

/** 'DeletePostAndReturn' return type */
export interface IDeletePostAndReturnResult {
  id: number;
  timestamp: Date;
  key: Json;
  iv: string;
  author_id: number;
  filename: string;
}

/** 'DeletePostAndReturn' query type */
export interface IDeletePostAndReturnQuery {
  params: IDeletePostAndReturnParams;
  result: IDeletePostAndReturnResult;
}

const deletePostAndReturnIR: any = {"name":"DeletePostAndReturn","params":[{"name":"postId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1413,"b":1418,"line":36,"col":30}]}},{"name":"authorId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1437,"b":1444,"line":36,"col":54}]}}],"usedParamSet":{"postId":true,"authorId":true},"statement":{"body":"DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *","loc":{"a":1383,"b":1456,"line":36,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM posts WHERE id = :postId AND author_id = :authorId RETURNING *
 * ```
 */
export const deletePostAndReturn = new PreparedQuery<IDeletePostAndReturnParams,IDeletePostAndReturnResult>(deletePostAndReturnIR);


/** 'GetFollowRequestsByRequesteeId' parameters type */
export interface IGetFollowRequestsByRequesteeIdParams {
  requesteeId: number | null | void;
}

/** 'GetFollowRequestsByRequesteeId' return type */
export interface IGetFollowRequestsByRequesteeIdResult {
  requester_id: number;
}

/** 'GetFollowRequestsByRequesteeId' query type */
export interface IGetFollowRequestsByRequesteeIdQuery {
  params: IGetFollowRequestsByRequesteeIdParams;
  result: IGetFollowRequestsByRequesteeIdResult;
}

const getFollowRequestsByRequesteeIdIR: any = {"name":"GetFollowRequestsByRequesteeId","params":[{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1566,"b":1576,"line":39,"col":63}]}}],"usedParamSet":{"requesteeId":true},"statement":{"body":"SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId","loc":{"a":1503,"b":1576,"line":39,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT requester_id FROM follow_requests WHERE requestee_id = :requesteeId
 * ```
 */
export const getFollowRequestsByRequesteeId = new PreparedQuery<IGetFollowRequestsByRequesteeIdParams,IGetFollowRequestsByRequesteeIdResult>(getFollowRequestsByRequesteeIdIR);


/** 'GetFollowersByFolloweeId' parameters type */
export interface IGetFollowersByFolloweeIdParams {
  followeeId: number | null | void;
}

/** 'GetFollowersByFolloweeId' return type */
export interface IGetFollowersByFolloweeIdResult {
  follower_id: number;
}

/** 'GetFollowersByFolloweeId' query type */
export interface IGetFollowersByFolloweeIdQuery {
  params: IGetFollowersByFolloweeIdParams;
  result: IGetFollowersByFolloweeIdResult;
}

const getFollowersByFolloweeIdIR: any = {"name":"GetFollowersByFolloweeId","params":[{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1672,"b":1681,"line":42,"col":55}]}}],"usedParamSet":{"followeeId":true},"statement":{"body":"SELECT follower_id FROM followers WHERE followee_id = :followeeId","loc":{"a":1617,"b":1681,"line":42,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT follower_id FROM followers WHERE followee_id = :followeeId
 * ```
 */
export const getFollowersByFolloweeId = new PreparedQuery<IGetFollowersByFolloweeIdParams,IGetFollowersByFolloweeIdResult>(getFollowersByFolloweeIdIR);


/** 'GetFolloweesByFollowerId' parameters type */
export interface IGetFolloweesByFollowerIdParams {
  followerId: number | null | void;
}

/** 'GetFolloweesByFollowerId' return type */
export interface IGetFolloweesByFollowerIdResult {
  followee_id: number;
}

/** 'GetFolloweesByFollowerId' query type */
export interface IGetFolloweesByFollowerIdQuery {
  params: IGetFolloweesByFollowerIdParams;
  result: IGetFolloweesByFollowerIdResult;
}

const getFolloweesByFollowerIdIR: any = {"name":"GetFolloweesByFollowerId","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1777,"b":1786,"line":45,"col":55}]}}],"usedParamSet":{"followerId":true},"statement":{"body":"SELECT followee_id FROM followers WHERE follower_id = :followerId","loc":{"a":1722,"b":1786,"line":45,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT followee_id FROM followers WHERE follower_id = :followerId
 * ```
 */
export const getFolloweesByFollowerId = new PreparedQuery<IGetFolloweesByFollowerIdParams,IGetFolloweesByFollowerIdResult>(getFolloweesByFollowerIdIR);


/** 'DeleteFollower' parameters type */
export interface IDeleteFollowerParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'DeleteFollower' return type */
export type IDeleteFollowerResult = void;

/** 'DeleteFollower' query type */
export interface IDeleteFollowerQuery {
  params: IDeleteFollowerParams;
  result: IDeleteFollowerResult;
}

const deleteFollowerIR: any = {"name":"DeleteFollower","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1860,"b":1869,"line":48,"col":43}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1890,"b":1899,"line":48,"col":73}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"DELETE FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId","loc":{"a":1817,"b":1899,"line":48,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM followers WHERE follower_id = :followerId AND followee_id = :followeeId
 * ```
 */
export const deleteFollower = new PreparedQuery<IDeleteFollowerParams,IDeleteFollowerResult>(deleteFollowerIR);


/** 'DeleteFollowRequest' parameters type */
export interface IDeleteFollowRequestParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'DeleteFollowRequest' return type */
export type IDeleteFollowRequestResult = void;

/** 'DeleteFollowRequest' query type */
export interface IDeleteFollowRequestQuery {
  params: IDeleteFollowRequestParams;
  result: IDeleteFollowRequestResult;
}

const deleteFollowRequestIR: any = {"name":"DeleteFollowRequest","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1985,"b":1995,"line":51,"col":50}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2017,"b":2027,"line":51,"col":82}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId","loc":{"a":1935,"b":2027,"line":51,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId
 * ```
 */
export const deleteFollowRequest = new PreparedQuery<IDeleteFollowRequestParams,IDeleteFollowRequestResult>(deleteFollowRequestIR);


/** 'DeleteFollowRequestAndReturn' parameters type */
export interface IDeleteFollowRequestAndReturnParams {
  requesterId: number | null | void;
  requesteeId: number | null | void;
}

/** 'DeleteFollowRequestAndReturn' return type */
export interface IDeleteFollowRequestAndReturnResult {
  requester_id: number;
  requestee_id: number;
  timestamp: Date;
}

/** 'DeleteFollowRequestAndReturn' query type */
export interface IDeleteFollowRequestAndReturnQuery {
  params: IDeleteFollowRequestAndReturnParams;
  result: IDeleteFollowRequestAndReturnResult;
}

const deleteFollowRequestAndReturnIR: any = {"name":"DeleteFollowRequestAndReturn","params":[{"name":"requesterId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2122,"b":2132,"line":54,"col":50}]}},{"name":"requesteeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2154,"b":2164,"line":54,"col":82}]}}],"usedParamSet":{"requesterId":true,"requesteeId":true},"statement":{"body":"DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId RETURNING *","loc":{"a":2072,"b":2176,"line":54,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM follow_requests WHERE requester_id = :requesterId AND requestee_id = :requesteeId RETURNING *
 * ```
 */
export const deleteFollowRequestAndReturn = new PreparedQuery<IDeleteFollowRequestAndReturnParams,IDeleteFollowRequestAndReturnResult>(deleteFollowRequestAndReturnIR);


/** 'AddFollower' parameters type */
export interface IAddFollowerParams {
  followerId: number | null | void;
  followeeId: number | null | void;
}

/** 'AddFollower' return type */
export type IAddFollowerResult = void;

/** 'AddFollower' query type */
export interface IAddFollowerQuery {
  params: IAddFollowerParams;
  result: IAddFollowerResult;
}

const addFollowerIR: any = {"name":"AddFollower","params":[{"name":"followerId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2262,"b":2271,"line":57,"col":58}]}},{"name":"followeeId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":2275,"b":2284,"line":57,"col":71}]}}],"usedParamSet":{"followerId":true,"followeeId":true},"statement":{"body":"INSERT INTO followers (follower_id, followee_id) VALUES (:followerId, :followeeId)","loc":{"a":2204,"b":2285,"line":57,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO followers (follower_id, followee_id) VALUES (:followerId, :followeeId)
 * ```
 */
export const addFollower = new PreparedQuery<IAddFollowerParams,IAddFollowerResult>(addFollowerIR);


