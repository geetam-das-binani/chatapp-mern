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
	Input,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { logoutUser } from "../Reducers/userReducer";
import ChatLoading from "../components/ChatLoading.jsx";
import UsersListItem from "../components/Users/UsersListItem.jsx";

const SideDrawer = () => {
	const { user: loggedUser } = useSelector((state) => state.user);
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

			setSearchResults(data.users);
			setLoading(false);
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
	const accessChat = (userid) => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.token}`,
					"Content-Type": "application/json",
				},
			};
		} catch (error) {}
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
						<MenuButton p={1}>
							<BellIcon fontSize="2xl" margin={1} />
						</MenuButton>
						{/* <MenuList></MenuList> */}
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
							<ProfileModal>
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
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Fragment>
	);
};

export default SideDrawer;
