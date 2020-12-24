import Axios from 'axios'
import { NewUser } from '../../../backend/src/types/auth'
import devUrl from './devUrl'

const baseURL = `${devUrl}/signup`

const server = Axios.create({ withCredentials: false, baseURL })
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

export async function signup(newUser: NewUser) {
    await server.post('', {
        ...newUser,
    })
    return
}
