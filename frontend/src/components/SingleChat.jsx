import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelectedChat } from "../Reducers/chatReduer";
import {
	Box,
	FormControl,
	IconButton,
	useToast,
	Input,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	getSenderFullDetails,
	getSender,
	isUserOnline,
	getUserLastOnlineTime,
} from "../utils/chatUtils";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateModal from "../miscellaneous/UpdateModal";
import axios from "axios";
import Lottie from "react-lottie";
import ScrollableChats from "./ScrollableChats";
import animationData from "../animations/typing.json";
import { FaImage } from "react-icons/fa";
import { io } from "socket.io-client";
import { setNotifications } from "../Reducers/notificationsReducer";
import { setOnlineUsers } from "../Reducers/onlineReducer";
import {
	getAlluserMessages,
	handleImageOnChat,
	handleSendMessage,
} from "../actions/chatActions";
// let ENDPONT = "http://localhost:8000";
let ENDPONT = "https://wechat-0ytb.onrender.com";
let socket, selectedChatCompare;
const defaultOptons = {
	loop: true,
	autoPlay: true,
	animationData,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
};
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const { user: loggedUser } = useSelector((state) => state.user);
	const { onlineUsers } = useSelector((state) => state.onlineUsers);
	const { selectedChat } = useSelector((state) => state.chat);
	const [istyping, setisTyping] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();

	const fetchMessages = async () => {
		if (!selectedChat._id) return;
		getAlluserMessages(
			loggedUser,
			selectedChat._id,
			setLoading,
			setMessages,
			toast,
			socket
		);
	};
	const sendMessage = async (e) => {
		if (e.key === "Enter" && newMessage) {
			socket.emit("stop typing", { roomId: selectedChat._id });
			handleSendMessage(
				loggedUser,
				newMessage,
				messages,
				selectedChat._id,
				setNewMessage,
				setMessages,
				socket,
				toast
			);
		}
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		// typing Indicator logic

		if (!socketConnected) return;
		if (e.target.value && !istyping) {
			socket.emit("typing", { roomId: selectedChat._id });
		} else {
			socket.emit("stop typing", { roomId: selectedChat._id });
		}
		let lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;

			if (timeDiff >= timerLength && istyping) {
				setisTyping(false);
				socket.emit("stop typing", { roomId: selectedChat._id });
			} else {
				socket.emit("stop typing", { roomId: selectedChat._id });
			}
		}, timerLength);
	};

	const handleImage = async (e) => {
		const formData = new FormData();
		formData.set("chatId", selectedChat._id);
		formData.set("content", newMessage);
		formData.set("image", e.target.files[0]);
		handleImageOnChat(
			loggedUser,
			formData,
			setNewMessage,
			setMessages,
			messages,
			socket,
			toast
		);
	};
	useEffect(() => {
		socket = io(ENDPONT);
		socket.emit("setup", { userId: loggedUser.user._id });
		socket.on("connected", () => setSocketConnected(true));
		socket.on("stop typing", () => setisTyping(false));
		socket.on("typing", () => setisTyping(true));
		socket.on("user joined", (data) => {
			dispatch(setOnlineUsers(data));
		});

		return () => {
			socket.disconnect();
		};
	}, [loggedUser.user._id]);

	useEffect(() => {
		socket.on("user left", (data) => {
			dispatch(setOnlineUsers(data));
		});
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat._id]);

	useEffect(() => {
		socket.on("message received", (newMessageRecieved) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageRecieved.chats._id
			) {
				dispatch(setNotifications(newMessageRecieved));
				setFetchAgain(!fetchAgain);
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});

	return (
		<React.Fragment>
			{selectedChat._id ? (
				<>
					<Text
						fontSize={{ base: "20px", md: "25px" }}
						pb={3}
						w="100%"
						fontFamily="Work sans"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
						px={2}
						fontWeight="bold"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => {
								dispatch(userSelectedChat(""));
								setFetchAgain(!fetchAgain);
							}}
						/>
						{selectedChat.isGroupChat ? (
							<>
								{selectedChat.chatName.toUpperCase()}

								<UpdateModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						) : (
							<>
								{getSender(selectedChat?.users, loggedUser)}
								<>
									{isUserOnline(onlineUsers, selectedChat.users, loggedUser) ===
									"online"
										? "(online)"
										: getUserLastOnlineTime(
												onlineUsers,
												selectedChat.users,
												loggedUser
										  )
										? `-last seen ${getUserLastOnlineTime(
												onlineUsers,
												selectedChat.users,
												loggedUser
										  )}`
										: ""}
								</>
								<ProfileModal
									user={getSenderFullDetails(selectedChat.users, loggedUser)}
								/>
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#E8E8E8"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{loading ? (
							<Spinner
								size="xl"
								w={20}
								h={20}
								alignSelf={"center"}
								margin={"auto"}
							/>
						) : (
							<div className="messages">
								<ScrollableChats messages={messages} />
							</div>
						)}
						<FormControl
							display="flex"
							alignItems="center"
							mt={3}
							isRequired
							onKeyDown={sendMessage}
						>
							{istyping && (
								<div>
									<Lottie
										options={defaultOptons}
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/>
								</div>
							)}
							<Input
								variant="filled"
								placeholder="Enter a message ..."
								bg="#E0E0E0"
								onChange={typingHandler}
								value={newMessage}
							/>
							<label
								htmlFor="file"
								style={{
									display: "inline-block",
									margin: "0 1rem",
								}}
							>
								<input
									type="file"
									id="file"
									style={{ display: "none" }}
									onChange={handleImage}
								/>
								<FaImage />
							</label>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					h="100%"
				>
					<Text fontSize="3xl" pb={3} fontFamily="Work sans">
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</React.Fragment>
	);
};

export default SingleChat;
