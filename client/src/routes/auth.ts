import Axios from 'axios'
import { FinishLoginResult, StartLoginResult } from '../../../backend/src/types/auth'
import devUrl from './devUrl'

const baseURL = `${devUrl}/auth`

const server = Axios.create({ withCredentials: true, baseURL })
server.interceptors.response.use(
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
    const startRes = await server.post<StartLoginResult>('/startLogin', {
        username,
        clientEphemeralPublic,
    })
    return startRes.data
}

export async function finishLogin(clientSessionProof: string) {
    const finishRes = await server.post<FinishLoginResult>('/finishLogin', {
        clientSessionProof,
    })
    return finishRes.data
}

export async function cancelAuth() {
    await server.put('/cancel')
}
