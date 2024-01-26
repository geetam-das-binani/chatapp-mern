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
import { getSenderFullDetails, getSender } from "../utils/chatUtils";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateModal from "../miscellaneous/UpdateModal";
import axios from "axios";
import Lottie from "react-lottie";
import ScrollableChats from "./ScrollableChats";
import animationData from "../animations/typing.json";
import { io } from "socket.io-client";
let ENDPONT = "http://localhost:8000";
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
	const { selectedChat } = useSelector((state) => state.chat);
	const [istyping, setisTyping] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();

	const fetchMessages = async () => {
		if (!selectedChat._id) return;
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			const { data } = await axios.get(
				`/api/v1/messages/${selectedChat._id}`,
				config
			);

			setMessages(data);
			setLoading(false);
			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};
	const sendMessage = async (e) => {
		if (e.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${loggedUser.token}`,
						"Content-Type": "application/json",
					},
				};
				const { data } = await axios.post(
					`/api/v1/sendmessage`,
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);
				setNewMessage("");
				socket.emit("new message", data);
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: "Error Occured",
					description: error.response.data.message,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom-left",
				});
			}
		}
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		// typing Indicator logic
		if (!socketConnected) return;
		if (!istyping) {
			setisTyping(true);
			socket.emit("typing", selectedChat._id);
		}
		let lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;

			if (timeDiff >= timerLength && istyping) {
				setisTyping(false);
				socket.emit("stop typing", selectedChat._id);
			}
		}, timerLength);
	};
	useEffect(() => {
		socket = io(ENDPONT);
		socket.emit("setup", { userId: loggedUser.user._id });
		socket.on("connected", () => setSocketConnected(true));
		socket.on("stop typing", () => setisTyping(false));
		socket.on("typing", () => setisTyping(true));
	}, []);
	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat._id]);
	useEffect(() => {
		socket.on("message received", (newMessageRecieved) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageRecieved.chats._id
			) {
				// give notification
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
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						w="100%"
						fontFamily="Work sans"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
						px={2}
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => dispatch(userSelectedChat(""))}
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
						<FormControl mt={3} isRequired onKeyDown={sendMessage}>
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
