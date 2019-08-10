import mongoose, {Schema} from 'mongoose'

const UserSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
		},
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
		followers: [String],
		following: [String],
	},
	{
		timestamps: true
	}
)

export default mongoose.model("User", UserSchema)
