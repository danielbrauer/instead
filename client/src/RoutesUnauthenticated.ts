import config from './config'
import Axios from 'axios'
import { StartLoginResult, FinishLoginResult, NewUser } from '../../backend/src/types/auth'

const baseURL = `${config.serverUrl}/auth`

const authorizedAxios = Axios.create({ withCredentials: true, baseURL })
authorizedAxios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status >= 400) {
            throw new Error(error.response.data)
        }
        Promise.reject(error)
    },
)

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

export async function signup(newUser: NewUser) {
    await authorizedAxios.post('/signup', {
        ...newUser,
    })
    return
}

export async function cancelAuth() {
    await authorizedAxios.put('/cancel')
}
