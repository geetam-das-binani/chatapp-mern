import jwt from "jsonwebtoken";
import { User } from "../model/userModel.mjs";
import { asyncHandler } from "./asyncHandler.mjs";
import { ErrorHandler } from "../utils/errorHandler.mjs";
export const authorization = asyncHandler(async (req, res, next) => {
	if (
		!(
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		)
	) {
		return next(new ErrorHandler("No token provided", 401));
	}
	const token = req.headers.authorization.split(" ")[1];
	try {
		// decodes token id
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);

		if (!user) {
			return next(new ErrorHandlerrHandler("Invalid token", 401));
		}
		req.user = user;
		next();
	} catch (error) {
		return next(new ErrorHandler("Invalid token", 401));
	}
});
