import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelectedChat } from "../Reducers/chatReduer";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderFullDetails, getSender } from "../utils/chatUtils";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateModal from "../miscellaneous/UpdateModal";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user: loggedUser } = useSelector((state) => state.user);
	const { selectedChat, chats } = useSelector((state) => state.chat);
	const dispatch = useDispatch();

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
						justifyContent="center"
						p={3}
						bg="#E8e8e8"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						Messages here
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
