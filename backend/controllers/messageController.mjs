import { asyncHandler } from "../middlewares/asyncHandler.mjs";
import { Chat } from "../model/chatModel.mjs";
import { Message } from "../model/messsageModel.mjs";
import { User } from "../model/userModel.mjs";
import { ErrorHandler } from "../utils/errorHandler.mjs";

export const sendMessage = asyncHandler(async (req, res, next) => {
	const { content, chatId } = req.body;

	if (!content || !chatId) {
		return next(new ErrorHandler("Invalid data passed to request", 400));
	}
	const newMessage = {
		sender: req.user._id,
		content,
		chats: chatId,
	};
	let message = await Message.create(newMessage);
	if (!message) return next(new ErrorHandler("Unable to create messages", 400));
	message = await message.populate("sender", "name pic");
	message = await message.populate("chats");
	message = await User.populate(message, {
		path: "chats.users",
		select: "name pic email",
	});
	await Chat.findByIdAndUpdate(chatId, {
		latestMessage: message._id,
	});
	res.status(200).json(message);
});
export const allMessages = asyncHandler(async (req, res, next) => {
	const messages = await Message.find({ chats: req.params.chatId })
		.populate("sender", "name pic")
		.populate("chats");
	res.status(200).json(messages);
});
