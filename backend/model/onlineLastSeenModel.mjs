import mongoose from "mongoose";

const onlineStatusSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users", // Reference to your existing User model
		required: true,
		unique: true,
	},
	socketId: {
		type: String,
		required: true,
	},
	lastOnline: {
		type: Date,
		default: () => Date.now(),
	},
	status: {
		type: String,
		enum: ["online", "offline"],
		default: "online",
	},
});

export default mongoose.model("OnlineStatus", onlineStatusSchema);
