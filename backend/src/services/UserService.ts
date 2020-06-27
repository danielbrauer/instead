import { Service } from "typedi"
import db from '../services/database'
import * as Followers from '../queries/followers.gen'

@Service()
export default class UserService {

    async removeFollower(followerId: number, followeeId: number) {
        await Followers.destroy.run(
            { followerId: followerId, followeeId: followeeId },
            db
        )
    }
}

