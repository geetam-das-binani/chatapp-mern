import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		content: {
			type: String,
			trim: true,
			default: null,
		},
		chats: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "chats",
		},
		image: String,
	},
	{
		timestamps: true,
	}
);

export const Message = mongoose.model("messages", messageSchema);
