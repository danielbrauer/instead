import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation'
import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const empty = Joi.object()

export const startLoginBody = Joi.object({
    username: Joi.string().min(2).max(100).required(),
    clientEphemeralPublic: Joi.string().hex().required(),
})

export interface StartLoginRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof startLoginBody>
}

export const finishLoginBody = Joi.object({
    clientSessionProof: Joi.string().hex().required(),
})

export interface FinishLoginRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof finishLoginBody>
}

export const signupBody = Joi.object({
    username: Joi.string().alphanum().min(1).max(200).required(),
    verifier: Joi.string().hex().required(),
    srpSalt: Joi.string().hex().required(),
    mukSalt: Joi.string().hex().required(),
    publicKey: Joi.object().required(),
    privateKey: Joi.string().base64().required(),
    privateKeyIv: Joi.string().base64().required(),
})

export interface SignupRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof empty>
    [ContainerTypes.Body]: Joi.extractType<typeof signupBody>
}
