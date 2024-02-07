import React, { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	IconButton,
	useDisclosure,
	Button,
	Box,
	FormControl,
	Input,
	useToast,
	Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import UserBadgeItem from "../components/Users/UserBadgeItem";

import { userSelectedChat } from "../Reducers/chatReduer";
import UsersListItem from "../components/Users/UsersListItem";
import {
	addNewUserToGroup,
	leaveGroup,
	renameGroup,
	searchUserToAddInGroup,
	userRemove,
} from "../actions/chatActions";
const UpdateModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user: loggedUser } = useSelector((state) => state.user);
	const toast = useToast();
	const dispatch = useDispatch();
	const { selectedChat } = useSelector((state) => state.chat);
	const [groupChatName, setGroupChatName] = useState("");
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);
	const handleRemoveUserFromGroup = async (user) => {
		if (!(selectedChat.groupAdmin._id === loggedUser.user._id)) {
			toast({
				title: "Only Admins can remove someone",

				status: "error",

				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		userRemove(
			loggedUser,
			user._id,
			selectedChat._id,
			dispatch,
			userSelectedChat,
			setFetchAgain,
			fetchMessages,
			fetchAgain,
			toast
		);
	};
	const handleAddUser = async (user) => {
		addNewUserToGroup(
			user,
			selectedChat,
			loggedUser,
			setLoading,
			setFetchAgain,
			fetchAgain,
			dispatch,
			userSelectedChat,
			toast
		);
	};
	const handleRename = async () => {
		if (!groupChatName) return;
		renameGroup(
			setRenameLoading,
			loggedUser,
			selectedChat._id,
			groupChatName,
			setFetchAgain,
			fetchAgain,
			dispatch,
			userSelectedChat,
			toast,
			setGroupChatName
		);
	};
	const handleSearch = async (e) => {
		setSearch(e.target.value);
		if (!e.target.value) {
			return;
		}
		searchUserToAddInGroup(
			setLoading,
			loggedUser,
			setSearchResults,
			toast,
			search
		);
	};

	const handleLeaveGroup = async () => {
		leaveGroup(
			loggedUser,
			selectedChat._id,
			dispatch,
			userSelectedChat,
			setFetchAgain,
			fetchAgain,
			toast
		);
	};
	return (
		<>
			<IconButton
				display={{ base: "flex" }}
				icon={<ViewIcon />}
				onClick={onOpen}
			/>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="35px"
						fontFamily="Work sans"
						display="flex"
						justifyContent="center"
					>
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box w="100%" display="flex" flexWrap="wrap" gap={"5px"} pb={3}>
							{selectedChat.users.map((user) => (
								<UserBadgeItem
									key={user._id}
									{...user}
									handleFunction={() => handleRemoveUserFromGroup(user)}
								/>
							))}
						</Box>

						<FormControl display="flex">
							<Input
								placeholder="Chat Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								colorScheme="teal"
								variant="solid"
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}
							>
								update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add Users to group"
								mb={1}
								value={search}
								onChange={handleSearch}
							/>
						</FormControl>
						{loading ? (
							<Spinner size="lg" />
						) : (
							searchResults
								?.slice(0, 4)
								.map((user) => (
									<UsersListItem
										key={user._id}
										{...user}
										handleFunction={() => handleAddUser(user)}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="red" mr={3} onClick={() => handleLeaveGroup()}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateModal;
