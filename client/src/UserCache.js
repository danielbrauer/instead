class UserCache {
    constructor(getData, setData, authorizedAxios, getUserUrl) {
        this.getData = getData
        this.setData = setData
        this.authorizedAxios = authorizedAxios
        this.getUserUrl = getUserUrl

        this.placeHolderUser = {
            username: "loading",
        }
    }

    getUser(userid) {
        const user = this.getData()[userid]
        if (user === undefined) {
            this.authorizedAxios.post(this.getUserUrl, {userid})
            .then(response => {
                this.setData(response.data.user)
            })
            return this.placeHolderUser
        } else {
            return user
        }
    }
}

export default UserCache