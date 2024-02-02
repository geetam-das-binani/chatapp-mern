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
import { Server } from "socket.io";
import http from "http";
import OnlineStatus from "./model/onlineLastSeenModel.mjs";
const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: "*",
	},
});

let userOnlineLastSeeninfo = [];

io.on("connection", (socket) => {
	socket.on("setup", async (userData) => {
		socket.join(userData.userId);

		socket.emit("connected");

		try {
			const existingUser = await OnlineStatus.findOne({
				userId: userData.userId,
			});

			if (!existingUser) {
				const userObj = {
					userId: userData.userId,
					socketId: socket.id,
				};
				await OnlineStatus.create(userObj);
			} else {
				await OnlineStatus.findOneAndUpdate(
					{ userId: userData.userId },
					{
						$set: {
							socketId: socket.id,
							lastOnline: Date.now(),
							status: "online",
						},
					}
				);
			}

			const allUsers = await OnlineStatus.find({});
			userOnlineLastSeeninfo = allUsers;
			io.emit("user joined", userOnlineLastSeeninfo);
		} catch (error) {
			console.error("Error setting up user:", error);
		}
	});
	socket.on("join chat", (room) => {
		socket.join(room.roomId);
	});
	socket.on("typing", (room) =>
		socket.broadcast.to(room.roomId).emit("typing")
	);
	socket.on("stop typing", (room) =>
		socket.broadcast.to(room.roomId).emit("stop typing")
	);
	socket.on("new message", (newMessageReceived) => {
		let chat = newMessageReceived.chats;

		if (!chat.users) return console.log("chat.users not defined");
		chat.users.forEach((user) => {
			if (user._id === newMessageReceived.sender._id) return;
			socket.in(user._id).emit("message received", newMessageReceived);
		});
	});
	socket.on("disconnect", async () => {
		try {
			await OnlineStatus.findOneAndUpdate(
				{ socketId: socket.id },
				{ $set: { status: "offline", lastOnline: Date.now() } }
			);

			const existingUsers = await OnlineStatus.find({});
			userOnlineLastSeeninfo = existingUsers;

			io.emit("user left", userOnlineLastSeeninfo);
		} catch (error) {
			console.error("Error handling disconnect event:", error);
		}
	});
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", messageRoutes);

// middleware for error
app.use(notFound);
app.use(errorMiddleware);
connectToDatabase()
	.then(() => {
		server.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
	})
	.catch((error) => {
		console.log(error.message);
		process.exit();
	});
