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
		},
		chats: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "chats",
		},
	},
	{
		timestamps: true,
	}
);

export const Message = mongoose.model("messages", messageSchema);
