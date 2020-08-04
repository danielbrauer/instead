import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation'
import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const empty = Joi.object()

export const deletePostQuery = Joi.object({
    id: Joi.number().integer().required(),
})

export interface DeletePostRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof deletePostQuery>;
    [ContainerTypes.Body]: Joi.extractType<typeof empty>;
}

export const createCurrentKeyBody = Joi.object({
    key: Joi.string().base64().required(),
})

export interface CreateCurrentKeyRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof createCurrentKeyBody>;
}

export const addKeysBody = Joi.object({
    keys: Joi.array().min(1).items(
        {
            userId: Joi.number().required(),
            keySetId: Joi.number().required(),
            key: Joi.string().base64().required(),
        }
    ),
})

export interface AddKeysRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof addKeysBody>;
}

export const startPostBody = Joi.object({
    keyId: Joi.number().required(),
    iv: Joi.string().base64().required(),
    md5: Joi.string().base64().required(),
    aspect: Joi.number().required(),
})

export interface StartPostRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof startPostBody>;
}

export const finishPostBody = Joi.object({
    success: Joi.boolean().required(),
    postId: Joi.number().required(),
})

export interface FinishPostRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof finishPostBody>;
}

export const getUserByIdQuery = Joi.object({
    userid: Joi.number().required(),
})

export interface GetUserByIdRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getUserByIdQuery>;
    [ContainerTypes.Body]: Joi.extractType<typeof empty>;
}

export const getByUserIdBody = Joi.object({
    userid: Joi.number().required(),
})

export interface GetByUserIdRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof getByUserIdBody>;
}