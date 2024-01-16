import { asyncHandler } from "../middlewares/asyncHandler.mjs";
import { ErrorHandler } from "../utils/errorHandler.mjs";
import { User } from "../model/userModel.mjs";
import { sendResponse } from "../utils/sendResponse.mjs";
import { v2 as cloudinary } from "cloudinary";
export const registerUser = asyncHandler(async (req, res, next) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return next(new ErrorHandler("All fields are required ", 400));
	}
	const isUserExist = await User.findOne({ email });
	if (isUserExist) return next(new ErrorHandler("User already exists", 400));
	const userObj = {
		name,
		email,
		password,
	};

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
		userObj.pic = mycloud.secure_url;
		const newUser = await User.create(userObj);

		return sendResponse(newUser, res, 201);
	}

	const newUser = await User.create(userObj);

	sendResponse(newUser, res, 201);
});

export const loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//  checking if user has given password and email or not
	if (!password || !email) {
		return next(new ErrorHandler("All fields are required", 400));
	}

	const isRegisteredUser = await User.findOne({ email }).select("+password");

	if (!isRegisteredUser)
		return next(new ErrorHandler("Invalid email or password", 401));

	const isPasswordMatched = await isRegisteredUser.comparePassword(password);
	if (!isPasswordMatched)
		return next(new ErrorHandler("Invalid Credentials", 401));

	sendResponse(isRegisteredUser, res, 201);
});
export const allUsers = asyncHandler(async (req, res, next) => {
	const keyword = req.query.keyword
		? {
				$or: [
					{ name: { $regex: req.query.keyword, $options: "i" } },
					{
						email: { $regex: req.query.keyword, $options: "i" },
					},
				],
		  }
		: {};
	// get all users except the one who is currenly logged in otherwise in search
	// results  may be the logged in user will also be there which is not ideal

	// const users = await User.find({ ...keyword }).find({
	// 	_id: { $ne: req.user._id },
	// });
	// or below one
	const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
	res.status(200).json({
		users,
	});
});
