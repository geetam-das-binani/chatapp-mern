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
import ScrollableChats from "./ScrollableChats";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const { user: loggedUser } = useSelector((state) => state.user);
	const { selectedChat } = useSelector((state) => state.chat);
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
			console.log(data);
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
	};
	useEffect(() => {
		fetchMessages();
	}, [selectedChat._id]);
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
