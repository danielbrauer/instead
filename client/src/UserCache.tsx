import { AxiosInstance } from "axios"
import { User } from './Interfaces'

class UserCache {
    getExistingUser: (userid : string) => User
    addUser: (user : User) => void
    authorizedAxios: AxiosInstance
    getUserUrl: string
    placeHolderUser: User

    constructor(getUser : (userid : string) => User, setData : (user : User) => void, authorizedAxios : AxiosInstance, getUserUrl : string) {
        this.getExistingUser = getUser
        this.addUser = setData
        this.authorizedAxios = authorizedAxios
        this.getUserUrl = getUserUrl

        this.placeHolderUser = {
            _id: "",
            username: "loading",
        }
    }

    getUser = (userid : string) : User => {
        const user = this.getExistingUser(userid)
        if (user === undefined) {
            this.authorizedAxios.get(this.getUserUrl, {
                params: {userid: userid}
            })
            .then(response => {
                this.addUser(response.data.user)
            })
            return this.placeHolderUser
        } else {
            return user
        }
    }
}

export default UserCache