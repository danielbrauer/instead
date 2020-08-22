import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation'
import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const empty = Joi.object()

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
