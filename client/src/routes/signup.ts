import config from '../config'
import Axios from 'axios'
import { NewUser } from '../../../backend/src/types/auth'

const baseURL = `${config.serverUrl}/signup`

const authorizedAxios = Axios.create({ withCredentials: false, baseURL })
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

export async function signup(newUser: NewUser) {
    await authorizedAxios.post('', {
        ...newUser,
    })
    return
}
