const mongoose = require('mongoose')
const Schema = require('mongoose').Schema

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

module.exports = mongoose.model("Post", PostSchema)
