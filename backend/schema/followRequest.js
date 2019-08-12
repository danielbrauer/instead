const mongoose = require('mongoose')
const Schema = require('mongoose').Schema

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

module.exports = mongoose.model("FollowRequest", FollowRequestSchema)
