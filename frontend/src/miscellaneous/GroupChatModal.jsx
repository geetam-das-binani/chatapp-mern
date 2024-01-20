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
import axios from "axios";
import { userChats } from "../Reducers/chatReduer";
import { useSelector, useDispatch } from "react-redux";
import UsersListItem from "../components/Users/UsersListItem";
import UserBadgeItem from "../components/Users/UserBadgeItem";
const GroupChatModal = ({ children }) => {
	const { chats } = useSelector((state) => state.chat);
	const { user: loggedUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			const { data } = await axios.get(
				`/api/v1/allusers?keyword=${search}`,
				config
			);

			setLoading(false);
			setSearchResults(data.users);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to fetch the Search Results",
				status: "error",

				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
		}
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

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			const { data } = await axios.post(
				`/api/v1/groupcreate`,
				{
					selectedUsers: JSON.stringify(selectedUsers.map((i) => i._id)),
					name: groupChatName,
				},
				config
			);
			dispatch(userChats([...data, ...chats]));
			onClose();
			toast({
				title: "New Group Chat Created!",

				status: "success",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		} catch (error) {
			toast({
				title: "Failed to create ",

				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		}
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
						<Button colorScheme="blue" onClick={handleSubmit}>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
