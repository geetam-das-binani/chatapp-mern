import { asyncHandler } from "../middlewares/asyncHandler.mjs";
import { Chat } from "../model/chatModel.mjs";
import { Message } from "../model/messsageModel.mjs";
import { User } from "../model/userModel.mjs";
import { ErrorHandler } from "../utils/errorHandler.mjs";
import { v2 as cloudinary } from "cloudinary";
export const sendMessage = asyncHandler(async (req, res, next) => {
	const { content, chatId } = req.body;
	const newMessage = {
		sender: req.user._id,
		content,
		chats: chatId,
	};
	console.log(newMessage);
	if (req?.file !== undefined) {
		const mycloud = await cloudinary.uploader.upload(req.file.path, {
			folder: "chatApp",
			width: 150,
			crop: "scale",
		});

		if (!mycloud) {
			return next(
				new ErrorHandler(
					"Something went wrong while uploading.Please Try Again.",
					400
				)
			);
		}
		newMessage.image = mycloud.secure_url;
	}

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
	console.log(message);
	return res.status(200).json(message);
});
export const allMessages = asyncHandler(async (req, res, next) => {
	const messages = await Message.find({ chats: req.params.chatId })
		.populate("sender", "name pic")
		.populate("chats");
	res.status(200).json(messages);
});
