
import config from './config'
import Axios from 'axios'
import { StartLoginResult, FinishLoginResult, StartSignupResult } from '../../backend/src/types/auth'

const baseURL = `${config.serverUrl}/auth`

const authorizedAxios = Axios.create({ withCredentials: true, baseURL })
authorizedAxios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response?.status >= 400) {
        throw new Error(error.response.data)
    }
    Promise.reject(error)
})

export async function startLogin(username: string, clientEphemeralPublic: string) {
    const startRes = await authorizedAxios.post<StartLoginResult>('/startLogin', {
        username,
        clientEphemeralPublic,
    })
    return startRes.data
}

export async function finishLogin(clientSessionProof: string) {
    const finishRes = await authorizedAxios.post<FinishLoginResult>('/finishLogin', {
        clientSessionProof,
    })
    return finishRes.data
}

export async function startSignup() {
    const startRes = await authorizedAxios.get<StartSignupResult>('/startSignup')
    return startRes.data
}

export async function finishSignup(displayName: string, srpSalt: string, verifier: string, mukSalt: string, publicKey: JsonWebKey, privateKey: string, privateKeyIv: string) {
    const finishRes = await authorizedAxios.post('/finishSignup', {
        displayName,
        srpSalt,
        verifier,
        mukSalt,
        publicKey,
        privateKey,
        privateKeyIv,
    })
    return
}

export async function cancelAuth() {
    await authorizedAxios.put('/cancel')
}