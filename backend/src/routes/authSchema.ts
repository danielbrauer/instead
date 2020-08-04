import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation'
import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const empty = Joi.object()

export const startLoginBody = Joi.object({
    username: Joi.string().required(),
    clientEphemeralPublic: Joi.string().hex().required(),
})

export interface StartLoginRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof startLoginBody>;
}

export const finishLoginBody = Joi.object({
    clientSessionProof: Joi.string().hex().required(),
})

export interface FinishLoginRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof finishLoginBody>;
}

export interface StartSignupRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof empty>;
}

export const finishSignupBody = Joi.object({
    displayName: Joi.string().required(),
    verifier: Joi.string().hex().required(),
    srpSalt: Joi.string().hex().required(),
    mukSalt: Joi.string().hex().required(),
    publicKey: Joi.object().required(),
    privateKey: Joi.string().base64().required(),
    privateKeyIv: Joi.string().base64().required(),
})

export interface FinishSignupRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>;
    [ContainerTypes.Body]: Joi.extractType<typeof finishSignupBody>;
}