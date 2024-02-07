import {
	Box,
	Button,
	Tooltip,
	Text,
	Menu,
	MenuButton,
	Avatar,
	MenuList,
	MenuItem,
	MenuDivider,
	useToast,
	Drawer,
	useDisclosure,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Input,
	Spinner,
	Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { logoutUser } from "../Reducers/userReducer";
import ChatLoading from "../components/ChatLoading";
import UsersListItem from "../components/Users/UsersListItem";
import { userSelectedChat, userChats } from "../Reducers/chatReduer";
import { clearNotifications } from "../Reducers/notificationsReducer";
import { getSender } from "../utils/chatUtils";
import { accessChat, searchAUser } from "../actions/chatActions";
const SideDrawer = () => {
	const { user: loggedUser } = useSelector((state) => state.user);
	const { chats } = useSelector((state) => state.chat);
	const { notifications } = useSelector((state) => state.notifications);
	const dispatch = useDispatch();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const handleLogout = () => {
		dispatch(logoutUser());
		toast({
			description: "Logout success ",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
	};
	const handleSearch = async () => {
		if (!search) {
			toast({
				description: "Enter something to search ",
				status: "warning",

				duration: 3000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}
		searchAUser(loggedUser, search, setSearchResults, setLoading, toast);
	};
	const handleAccessChat = async (userId) => {
		accessChat(
			userId,
			setLoadingChat,
			loggedUser,
			chats,
			dispatch,
			userChats,
			userSelectedChat,
			onClose,
			toast
		);
	};

	return (
		<Fragment>
			<Box
				display="flex"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
				borderWidth="5px"
				justifyContent="space-between"
			>
				<Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
					<Button variant="ghost" onClick={onOpen}>
						<i className="fa-solid fa-magnifying-glass"></i>
						<Text d={{ base: "none", md: "flex" }} px="4">
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl" fontFamily="Work sans">
					We Chat
				</Text>
				<div>
					<Menu>
						<MenuButton position="relative" p={1}>
							{notifications.length > 0 && (
								<Badge
									borderRadius="16px"
									ml="1"
									color="white"
									background="red"
									position="absolute"
									left="1px"
								>
									{notifications.length}
								</Badge>
							)}

							<BellIcon fontSize="2xl" margin={1} />
						</MenuButton>
						<MenuList pl={2}>
							{!notifications.length && "No New Messsages"}
							{notifications.map((notif) => (
								<MenuItem
									key={notif._id}
									onClick={() => {
										dispatch(userSelectedChat(notif.chats));
										dispatch(clearNotifications(notif));
									}}
								>
									{notif.chats.isGroupChat
										? `New Message in ${notif.chats.chatName}`
										: `New Message from ${getSender(
												notif.chats.users,
												loggedUser
										  )}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size="sm"
								cursor="pointer"
								name={loggedUser.user.name.split(" ")[0]}
								src={loggedUser.user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModal {...loggedUser}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer placement="left" onClose={onclose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderWidth="1px">Search Users</DrawerHeader>
					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name or email"
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResults?.map((user) => (
								<UsersListItem
									key={user._id}
									{...user}
									handleFunction={() => handleAccessChat(user._id)}
								/>
							))
						)}
						{loadingChat && <Spinner ml="auto" display="flex" />}
					</DrawerBody>
					<DrawerFooter>
						<Button colorScheme="red" mr={3} onClick={onClose}>
							Cancel
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</Fragment>
	);
};

export default SideDrawer;
