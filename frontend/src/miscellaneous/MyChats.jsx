import React, { useEffect } from "react";
import { Box, Button, Stack, useToast, Text, Badge } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { userSelectedChat } from "../Reducers/chatReduer";

import {
	getSender,
	getSenderFullDetails,
	isUserOnline,
} from "../utils/chatUtils";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../components/ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { getAllChats } from "../actions/chatActions";
const MyChats = ({ fetchAgain }) => {
	const dispatch = useDispatch();
	const { selectedChat, chats } = useSelector((state) => state.chat);
	const { user: loggedUser } = useSelector((state) => state.user);
	const { onlineUsers } = useSelector((state) => state.onlineUsers);
	const toast = useToast();
	const fetchChats = async () => {
		getAllChats(loggedUser, dispatch, toast);
	};
	useEffect(() => {
		fetchChats();
	}, [fetchAgain]);

	const formattedDate = (date) => {
		if (!date) return "";
		const [hr, min, ...rest] = new Date(date).toLocaleTimeString().split(":");
		return `${hr}:${min} ${rest.join("").slice(2)}`;
	};

	return (
		<Box
			display={{ base: selectedChat._id ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg="white"
			w={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "28px", md: "30px" }}
				fontFamily="Work sans"
				display="flex"
				w="100%"
				justifyContent="space-between"
				alignItems="center"
			>
				My Chats
				<GroupChatModal>
					<Button
						display="flex"
						fontSize={{ base: "17px", md: "10px", lg: "17px" }}
						rightIcon={<AddIcon />}
					>
						New Group Chat
					</Button>
				</GroupChatModal>
			</Box>
			<Box
				display="flex"
				flexDir="column"
				p={3}
				bg="#F8F8F8"
				w="100%"
				borderRadius="lg"
				h="100%"
				overflowY="hidden"
			>
				{chats.length > 0 ? (
					<Stack overflowY="scroll">
						{chats.length > 0 &&
							chats?.map((chat) => (
								<Box
									key={chat._id}
									onClick={() => dispatch(userSelectedChat(chat))}
									bg={selectedChat === chat ? "#38B2AC" : "#dadada"}
									color={selectedChat === chat ? "white" : "black"}
									px={3}
									py={2}
									borderRadius="lg"
									position="relative"
									display="flex"
									alignItems="center"
								>
									{!chat.isGroupChat ? (
										<img
											src={getSenderFullDetails(chat.users, loggedUser).pic}
											alt=""
											style={{
												objectFit: "cover",
												borderRadius: "20px",
												height: "2.5rem",
												width: "2.5rem",
											}}
										/>
									) : (
										<img
											src={chat.imageUrl}
											alt=""
											style={{
												objectFit: "cover",
												borderRadius: "20px",
												height: "2.5rem",
												width: "2.5rem",
											}}
										/>
									)}

									<Box
										display="flex"
										flexDir="column"
										position="relative"
										marginLeft="1rem"
										width="100%"
									>
										<Text>
											{!chat.isGroupChat
												? getSender(chat.users, loggedUser)
												: chat.chatName}
										</Text>
										<Text display="flex" as="b">
											<p>
												{chat?.latestMessage?.content ? (
													chat.latestMessage.content
												) : chat?.latestMessage?.image ? (
													<img
														style={{
															objectFit: "contain",
															height: "2rem",
															width: "2rem",
															borderRadius: "50%",
														}}
														src={chat?.latestMessage?.image}
													/>
												) : (
													""
												)}
											</p>
											<span
												style={{
													position: "absolute",
													right: 0,
												}}
											>
												{formattedDate(chat?.latestMessage?.createdAt ?? "")}
											</span>
										</Text>
									</Box>
									<Badge
										borderRadius="16px"
										variant="solid"
										colorScheme="green"
										position="absolute"
										top="0"
										right="0"
										height=".6rem"
										width=".6rem"
										background={
											chat.isGroupChat
												? ""
												: isUserOnline(onlineUsers, chat.users, loggedUser) ===
												  "online"
												? "green"
												: ""
										}
									/>
								</Box>
							))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
