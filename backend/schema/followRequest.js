import mongoose, {Schema} from 'mongoose'

const FollowRequestSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
        },
        requesterId: {
			type: String,
			required: true,
        },
		requesteeId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true
	}
)

export default mongoose.model("FollowRequest", FollowRequestSchema)
