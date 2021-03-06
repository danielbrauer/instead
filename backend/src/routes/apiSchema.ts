import * as Joi from '@hapi/joi'
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation'
import 'joi-extract-type'

export const empty = Joi.object()

export const postByIdParams = Joi.object({
    id: Joi.number().integer().required(),
})

export interface PostByIdRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof postByIdParams>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}

export const commentsForPostIdQuery = Joi.object({
    id: Joi.number().integer().required(),
    limit: Joi.number().integer().positive(),
})

export interface CommentsForPostIdRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof commentsForPostIdQuery>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}

export const createCommentBody = Joi.object({
    postId: Joi.number().integer().required(),
    keySetId: Joi.number().integer().required(),
    content: Joi.string().base64().required(),
    contentIv: Joi.string().base64().required(),
})

export interface CreateCommentRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof createCommentBody>
}

export const createCurrentKeyBody = Joi.object({
    key: Joi.string().base64().required(),
})

export interface CreateCurrentKeyRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof createCurrentKeyBody>
}

export const getKeyQuery = Joi.object({
    keySetId: Joi.number().integer().required(),
})

export interface GetKeyRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getKeyQuery>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}

export const addPostKeysBody = Joi.object({
    keys: Joi.array().min(1).items({
        recipientId: Joi.number().integer().required(),
        postKeySetId: Joi.number().integer().required(),
        key: Joi.string().base64().required(),
    }),
})

export interface AddPostKeysRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof addPostKeysBody>
}

export const startPostBody = Joi.object({
    postKeySetId: Joi.number().integer().required(),
    iv: Joi.string().base64().required(),
    md5: Joi.string().base64().required(),
    encryptedInfo: Joi.string().base64().required(),
})

export interface StartPostRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof startPostBody>
}

export const finishPostBody = Joi.object({
    success: Joi.boolean().required(),
    postId: Joi.number().integer().required(),
})

export interface FinishPostRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof finishPostBody>
}

export const createPostUpgradeBody = Joi.object({
    postId: Joi.number().integer().required(),
    md5: Joi.string().base64().required(),
    encryptedInfo: Joi.string().base64().required(),
})

export interface CreatePostUpgradeRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof createPostUpgradeBody>
}

export const applyPostUpgradeBody = Joi.object({
    postUpgradeId: Joi.number().integer().required(),
})

export interface ApplyPostUpgradeRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof applyPostUpgradeBody>
}

export const getByUserIdQuery = Joi.object({
    userId: Joi.number().integer().required(),
})

export interface GetByUserIdRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getByUserIdQuery>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}

export const getHomePostsQuery = Joi.object({
    pageIndex: Joi.string().regex(/^[0-9]+$/, 'integer'),
})

export interface GetHomePostsRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getHomePostsQuery>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}

export const getUserPostsQuery = Joi.object({
    userId: Joi.number().integer().required(),
    pageIndex: Joi.string().regex(/^[0-9]+$/, 'integer'),
})

export interface GetUserPostsRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getUserPostsQuery>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}

export const sendFollowRequestBody = Joi.object({
    friendCode: Joi.string().regex(/^[A-HJ-NP-Z2-9]+$/, 'friend code'),
})

export interface SendFollowRequestRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof sendFollowRequestBody>
}

export const putByUserIdBody = Joi.object({
    userId: Joi.number().integer().required(),
})

export interface PutByUserIdRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof putByUserIdBody>
}

const profileKey = Joi.object({
    recipientId: Joi.number().integer().required(),
    ownerId: Joi.number().integer().required(),
    key: Joi.string().base64().required(),
})

export const createProfileKeyBody = Joi.object({
    ownerKey: Joi.string().base64().required(),
    viewerKeys: Joi.array().items(profileKey),
})

export interface CreateProfileKeyRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof createProfileKeyBody>
}

export const addProfileKeysBody = Joi.object({
    viewerKeys: Joi.array().items(profileKey),
})

export interface AddProfileKeysRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof addProfileKeysBody>
}

export const addOrReplaceProfileKeyBody = Joi.object({
    viewerKey: profileKey,
})

export interface AddOrReplaceProfileKeyRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof addOrReplaceProfileKeyBody>
}

export const setProfileBody = Joi.object({
    displayName: Joi.string().base64().required(),
    displayNameIv: Joi.string().base64().required(),
})

export interface SetProfileRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof setProfileBody>
}

export const getActivityQuery = Joi.object({
    pageIndex: Joi.string().regex(/^[0-9]+$/, 'integer'),
})

export interface GetActivityRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getActivityQuery>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}

export const getActivityCountQuery = Joi.object({
    afterDate: Joi.date().required(),
})

export interface GetActivityCountRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getActivityCountQuery>
    [ContainerTypes.Body]: Joi.extractType<typeof empty>
}