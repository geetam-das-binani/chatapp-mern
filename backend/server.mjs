import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, "./config/config.env") });
import { v2 as cloudinary } from "cloudinary";
import { connectToDatabase } from "./database/database.mjs";
import { errorMiddleware } from "./middlewares/errorMiddleware.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import chatRoutes from "./routes/chatRoutes.mjs";
import messageRoutes from "./routes/messageRoutes.mjs";
import { notFound } from "./middlewares/notFound.mjs";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
// app.use(
// 	"*",
// 	cors({
// 		origin: true,
// 		credentials: true,
// 	})
// );
app.use("/api/v1", userRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", messageRoutes);

// middleware for error
app.use(notFound);
app.use(errorMiddleware);
connectToDatabase()
	.then(() => {
		app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
	})
	.catch((error) => {
		console.log(error.message);
		process.exit();
	});
