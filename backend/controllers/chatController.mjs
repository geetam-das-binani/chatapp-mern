import { asyncHandler } from "../middlewares/asyncHandler.mjs";
import { Chat } from "../model/chatModel.mjs";
import { User } from "../model/userModel.mjs";
import { ErrorHandler } from "../utils/errorHandler.mjs";
import { v2 as cloudinary } from "cloudinary";
export const createChat = asyncHandler(async (req, res, next) => {
	const { userId } = req.body;

	if (!userId) return next(new ErrorHandler("userid not send in request", 400));
	let isChat = await Chat.find({
		isGroupChat: false,
		users: { $all: [req.user._id, userId] },
	})
		.populate("users", "-password")
		.populate("latestMessage");

	isChat = await User.populate(isChat, {
		select: "name pic email",

		path: "latestMessage.sender",
	});
	console.log(isChat);
	if (isChat.length > 0) {
		return res.send(isChat[0]);
	}
	let chatData = {
		chatName: "sender",
		isGroupChat: false,
		users: [req.user._id, userId],
	};

	const createdChat = await Chat.create(chatData);
	if (!createdChat)
		return next(
			new ErrorHandler(
				"Something went Wrong while creating chat!Please Try Again",
				400
			)
		);

	const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
		"users",
		"-password"
	);

	res.status(200).send(fullChat);
});
export const fetchChats = asyncHandler(async (req, res, next) => {
	let chats = await Chat.find({
		users: { $elemMatch: { $eq: req.user._id } },
	})
		.populate("users", "-password")
		.populate("latestMessage")
		.populate("groupAdmin", "-password")
		.sort({ updatedAt: -1 });
	if (chats.length === 0)
		return next(new ErrorHandler("Unable to find chats", 400));
	chats = await User.populate(chats, {
		select: "name pic email",

		path: "latestMessage.sender",
	});
	res.status(200).send(chats);
});
export const createGroupChat = asyncHandler(async (req, res, next) => {
	if (!req.body.name || !req.body.selectedUsers.length || !req.body.imageUrl) {
		return next(new ErrorHandler("Please fill all the fields", 400));
	}

	const users = JSON.parse(req.body.selectedUsers);
	if (users.length < 2)
		return next(
			new ErrorHandler(
				"More than 2 users are required to form a group chat",
				400
			)
		);
	// add the logged in user to group
	users.push(req.user._id);
	console.log(req.body.imageUrl);
	const mycloud = await cloudinary.uploader.upload(req.body.imageUrl, {
		folder: "chatApp",
		width: 150,
		crop: "scale",
	});
	const groupChat = await Chat.create({
		chatName: req.body.name,
		isGroupChat: true,
		users: users,
		groupAdmin: req.user._id,
		imageUrl: mycloud.secure_url,
	});
	if (!groupChat) return next(new ErrorHandler("Unable to create", 400));
	await User.findByIdAndUpdate(req.user._id, {
		isAdmin: true,
	});
	const fullGroupChat = await Chat.find({ _id: groupChat._id })
		.populate("users", "-password")
		.populate("groupAdmin", "-password");
	res.status(200).json(fullGroupChat);
});
export const renameGroup = asyncHandler(async (req, res, next) => {
	const { chatName, chatGroupId } = req.body;
	if (!chatName || !chatGroupId)
		return next(new ErrorHandler("Please fill all the fields", 400));
	const updatedChat = await Chat.findByIdAndUpdate(
		chatGroupId,
		{
			$set: {
				chatName,
			},
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updatedChat)
		return next(new ErrorHandler("Unable to update GroupName", 404));

	res.status(200).json(updatedChat);
});

export const addToGroup = asyncHandler(async (req, res, next) => {
	const { userId, chatGroupId } = req.body;
	if (!userId || !chatGroupId)
		return next(new ErrorHandler("Please fill all the fields", 400));
	const updatedChat = await Chat.findByIdAndUpdate(
		chatGroupId,
		{
			$addToSet: {
				users: userId,
			},
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updatedChat) return next(new ErrorHandler("Unable to add ", 404));

	res.status(200).json(updatedChat);
});

export const removeFromGroup = asyncHandler(async (req, res, next) => {
	const { userId, chatGroupId } = req.body;
	if (!userId || !chatGroupId)
		return next(new ErrorHandler("Please fill all the fields", 400));

	const removedChatOfUser = await Chat.findByIdAndUpdate(
		chatGroupId,
		{
			$pull: {
				users: userId,
			},
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!removedChatOfUser) return next(new ErrorHandler("Unable to add ", 404));

	res.status(200).json(removedChatOfUser);
});
export const leaveGroup = asyncHandler(async (req, res, next) => {
	const { chatGroupId } = req.body;
	if (!chatGroupId)
		return next(new ErrorHandler("Please fill all the fields", 400));
	const isUserRemoved = await Chat.findByIdAndUpdate(
		chatGroupId,
		{
			$pull: {
				users: req.user._id,
			},
		},
		{
			new: true,
		}
	);

	if (!isUserRemoved) return next(new ErrorHandler("Unable to leave ", 403));

	res.status(200).json({
		message: "success",
	});
});
