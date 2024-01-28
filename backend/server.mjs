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

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: "*",
	},
});
io.on("connection", (socket) => {
	console.log("connected to socket.io");
	socket.on("setup", (userData) => {
		socket.join(userData.userId);

		socket.emit("connected");
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
	socket.off("setup", () => {
		console.log("USER DISCONNECTED");
		socket.leave(userData.userId);
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
