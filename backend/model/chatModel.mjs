import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
	{
		chatName: {
			type: String,
			trim: true,
		},
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "users",
			},
		],
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "messages",
		},
		imageUrl: {
			type: String,
			required: true,
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{
		timestamps: true,
	}
);

export const Chat = mongoose.model("chats", chatSchema);
