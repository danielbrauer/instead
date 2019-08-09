import mongoose, {Schema} from 'mongoose'

const PostSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		userid: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true
	}
)

export default mongoose.model("Post", PostSchema)
