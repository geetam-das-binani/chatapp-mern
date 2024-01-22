import React, { useEffect } from "react";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { userSelectedChat, userChats } from "../Reducers/chatReduer";
import axios from "axios";
import { getSender } from "../utils/chatUtils";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../components/ChatLoading";
import GroupChatModal from "./GroupChatModal";
const MyChats = ({ fetchAgain }) => {
	const dispatch = useDispatch();
	const { selectedChat, chats } = useSelector((state) => state.chat);
	const { user: loggedUser } = useSelector((state) => state.user);
	const toast = useToast();
	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			const { data } = await axios.get(`/api/v1/getallchats`, config);

			dispatch(userChats(data));
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
	useEffect(() => {
		fetchChats();
	}, [fetchAgain]);

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
								>
									<Text>
										{!chat.isGroupChat
											? getSender(chat.users, loggedUser)
											: chat.chatName}
									</Text>
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