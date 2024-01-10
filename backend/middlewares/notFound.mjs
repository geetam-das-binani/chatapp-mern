import { ErrorHandler } from "../utils/errorHandler.mjs";

export const notFound = (req, res, next) => {
	return next(new ErrorHandler(`Not Found ${req.originalUrl}`, 404));
};
