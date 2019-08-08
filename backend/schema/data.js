import mongoose, {Schema} from 'mongoose'

const DataSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true
	}
)

export default mongoose.model("Data", DataSchema)
