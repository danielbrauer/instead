
import config from './config'
import Axios from 'axios'
import { StartLoginResult, FinishLoginResult, StartSignupResult, FinishSignupResult } from '../../backend/src/types/auth'

const serverUrl = `${config.serverUrl}/auth`

const authorizedAxios = Axios.create({ withCredentials: true })
authorizedAxios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response?.status === 400) {
        throw new Error(error.response.data)
    }
    Promise.reject(error)
})

export const startLogin = async(username: string, clientEphemeralPublic: string) => {
    const startRes = await authorizedAxios.post<StartLoginResult>(serverUrl + '/startLogin', {
        username,
        clientEphemeralPublic,
    })
    return startRes.data
}

export const finishLogin = async(clientSessionProof: string) => {
    const finishRes = await authorizedAxios.post<FinishLoginResult>(serverUrl + '/finishLogin', {
        clientSessionProof,
    })
    return finishRes.data
}

export const startSignup = async() => {
    const startRes = await authorizedAxios.get<StartSignupResult>(serverUrl + '/startSignup')
    return startRes.data
}

export const finishSignup = async(displayName: string, srpSalt: string, verifier: string, mukSalt: string, publicKey: JsonWebKey, privateKey: string, privateKeyIv: string) => {
    const finishRes = await authorizedAxios.post<FinishSignupResult>(serverUrl + '/finishSignup', {
        displayName,
        srpSalt,
        verifier,
        mukSalt,
        publicKey,
        privateKey,
        privateKeyIv,
    })
    return finishRes.data
}