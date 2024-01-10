import { User } from "../model/userModel.mjs";
export const sendResponse = async (user, res, statusCode) => {
	const token = user.generateJwt();
	const userWithoutSensiveFields = await User.findById(user._id).select(
		"-password"
	);
	return res.status(statusCode).json({
		success: true,
		token,
		user: userWithoutSensiveFields,
	});
};
