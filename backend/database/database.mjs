import mongoose from "mongoose";

export const connectToDatabase = async () => {
	await mongoose.connect(process.env.MONGO__URL);
	console.log("Connected to Db Succesfully");
};
