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
import axios from "axios";
import { userSelectedChat } from "../Reducers/chatReduer";
import UsersListItem from "../components/Users/UsersListItem";
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

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			const { data } = await axios.put(
				`/api/v1/groupremove`,
				{
					userId: user._id,
					chatGroupId: selectedChat._id,
				},
				config
			);
			user._id === loggedUser.user._id
				? dispatch(userSelectedChat(""))
				: dispatch(userSelectedChat(data));

			setFetchAgain(!fetchAgain);
			fetchMessages(); // fetch latest messages after removing from group
		} catch (error) {
			toast({
				description: error.response.data.message,
				status: "error",

				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		}
	};
	const handleAddUser = async (user) => {
		if (selectedChat.users.find((u) => u._id === user._id)) {
			toast({
				title: "User already in group",

				status: "error",

				duration: 3000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}

		if (!(selectedChat.groupAdmin._id === loggedUser.user._id)) {
			toast({
				title: "Only Admins can add someone",

				status: "error",

				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			const { data } = await axios.put(
				`/api/v1/addToGroup`,
				{
					userId: user._id,
					chatGroupId: selectedChat._id,
				},
				config
			);
			setLoading(false);
			setFetchAgain(!fetchAgain);
			dispatch(userSelectedChat(data));
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",

				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		}
	};
	const handleRename = async () => {
		if (!groupChatName) return;
		try {
			setRenameLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			const { data } = await axios.put(
				`/api/v1/renamegroup`,
				{
					chatGroupId: selectedChat._id,
					chatName: groupChatName,
				},

				config
			);

			setFetchAgain(!fetchAgain);
			dispatch(userSelectedChat(data));
			setRenameLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",

				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			setRenameLoading(false);
		} finally {
			setGroupChatName("");
		}
	};
	const handleSearch = async (e) => {
		setSearch(e.target.value);
		if (!e.target.value) {
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

	const handleLeaveGroup = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			await axios.put(
				`/api/v1/groupremove`,
				{
					userId: loggedUser.user._id,
					chatGroupId: selectedChat._id,
				},
				config
			);

			dispatch(userSelectedChat(""));
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				description: error.response.data.message,
				status: "error",

				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		}
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
