import React, { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	useToast,
	FormControl,
	Input,
	Box,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import UsersListItem from "../components/Users/UsersListItem";
import UserBadgeItem from "../components/Users/UserBadgeItem";
import { createGroupChat, searchUsers } from "../actions/chatActions";
const GroupChatModal = ({ children }) => {
	const { chats } = useSelector((state) => state.chat);
	const { user: loggedUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [groupChatLoading, setGroupChatloading] = useState(false);
	const toast = useToast();

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}
		searchUsers(setLoading, loggedUser, search, setSearchResults, toast);
	};
	const handleSubmit = async () => {
		if (!groupChatName || selectedUsers.length < 2) {
			toast({
				title: "Error Occured!",
				description: "Please fill  all the fields",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
			return;
		}
		createGroupChat(
			loggedUser,
			selectedUsers,
			groupChatName,
			imageUrl,
			dispatch,
			chats,
			onClose,
			toast,
			setGroupChatloading
		);
	};
	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: "User Already Added",

				status: "warning",

				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
			return;
		}
		setSelectedUsers([...selectedUsers, userToAdd]);
	};
	const handleDelete = (userToRemove) => {
		setSelectedUsers(selectedUsers.filter((user) => user !== userToRemove));
	};
	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display="flex"
						fontSize="35px"
						justifyContent="center"
						fontFamily="Work sans"
					>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" alignItems="center" flexDir="column">
						<FormControl>
							<Input
								placeholder="Chat Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add Users"
								mb={1}
								value={search}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Image Url"
								mb={1}
								value={imageUrl}
								required
								onChange={(e) => setImageUrl(e.target.value)}
							/>
						</FormControl>
						<Box w="100%" display="flex" flexWrap="wrap">
							{selectedUsers.length > 0 &&
								selectedUsers?.map((user) => (
									<UserBadgeItem
										key={user._id}
										{...user}
										handleFunction={() => handleDelete(user)}
									/>
								))}
						</Box>

						{loading ? (
							<div>Loading</div>
						) : (
							searchResults
								?.slice(0, 4)
								.map((user) => (
									<UsersListItem
										key={user._id}
										{...user}
										handleFunction={() => handleGroup(user)}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							isLoading={groupChatLoading}
							onClick={handleSubmit}
						>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
