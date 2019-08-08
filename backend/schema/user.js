const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", UserSchema)
