import axios from "axios";
import { userChats } from "../Reducers/chatReduer";
export const getAlluserMessages = async (
	loggedUser,
	chatId,
	setLoading,
	setMessages,
	toast,
	socket
) => {
	setLoading(true);
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUser.token}`,
			},
		};
		const { data } = await axios.get(`/api/v1/messages/${chatId}`, config);
		setMessages(data);

		socket.emit("join chat", { roomId: chatId });
	} catch (error) {
		toast({
			title: "Error Occured",
			description: error.response.data.message,
			status: "error",
			duration: 3000,
			isClosable: true,
			position: "bottom-left",
		});
	} finally {
		setLoading(false);
	}
};
export const handleSendMessage = async (
	loggedUser,
	newMessage,
	messages,
	chatId,
	setNewMessage,
	setMessages,
	socket,
	toast
) => {
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
				chatId: chatId,
			},
			config
		);
		setNewMessage("");
		socket.emit("new message", data);
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
};
export const handleImageOnChat = async (
	loggedUser,
	formData,
	setNewMessage,
	setMessages,
	messages,
	socket,
	toast
) => {
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUser.token}`,
				"Content-Type": "multipart/form-data",
			},
		};
		const { data } = await axios.post(`/api/v1/sendmessage`, formData, config);
		setNewMessage("");
		socket.emit("new message", data);
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
};

export const searchUsers = async (
	setLoading,
	loggedUser,
	search,
	setSearchResults,
	toast
) => {
	setLoading(true);
	try {
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
	} finally {
		setLoading(false);
	}
};

export const createGroupChat = async (
	loggedUser,
	selectedUsers,
	groupChatName,
	imageUrl,
	dispatch,
	chats,
	onClose,
	toast,
	setGroupChatloading
) => {
	setGroupChatloading(true);
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
				imageUrl,
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
			title: error.response.data.message,

			status: "error",
			duration: 3000,
			isClosable: true,
			position: "bottom",
		});
	} finally {
		setGroupChatloading(false);
	}
};
export const getAllChats = async (loggedUser, dispatch, toast) => {
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
export const searchAUser = async (
	loggedUser,
	search,
	setSearchResults,
	setLoading,
	toast
) => {
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
	} catch (error) {
		toast({
			title: "Error Occured!",
			description: "Failed to fetch the Search Results",
			status: "error",

			duration: 3000,
			isClosable: true,
			position: "bottom-left",
		});
	} finally {
		setLoading(false);
	}
};

export const accessChat = async (
	userId,
	setLoadingChat,
	loggedUser,
	chats,
	dispatch,
	userChats,
	userSelectedChat,
	onClose,
	toast
) => {
	try {
		setLoadingChat(true);
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUser.token}`,
				"Content-Type": "application/json",
			},
		};
		const { data } = await axios.post("/api/v1/createchat", { userId }, config);

		if (!chats.find((c) => c._id === data._id))
			dispatch(userChats([...chats, data]));
		setLoadingChat(false);
		dispatch(userSelectedChat(data));

		onClose();
	} catch (error) {
		toast({
			title: "Error fetching the chat",
			description: error.message,
			status: "error",
			duration: 3000,
			isClosable: true,
			position: "bottom-left",
		});
	} finally {
		setLoadingChat(false);
	}
};
export const userRemove = async (
	loggedUser,
	userId,
	chatGroupId,
	dispatch,
	userSelectedChat,
	setFetchAgain,
	fetchMessages,
	fetchAgain,
	toast
) => {
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUser.token}`,
			},
		};
		const { data } = await axios.put(
			`/api/v1/groupremove`,
			{
				userId,
				chatGroupId,
			},
			config
		);
		userId === loggedUser.user._id
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
export const addNewUserToGroup = async (
	user,
	selectedChat,
	loggedUser,
	setLoading,
	setFetchAgain,
	fetchAgain,
	dispatch,
	userSelectedChat,
	toast
) => {
	if (selectedChat.users.some((u) => u._id === user._id)) {
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

export const renameGroup = async (
	setRenameLoading,
	loggedUser,
	chatGroupId,
	groupChatName,
	setFetchAgain,
	fetchAgain,
	dispatch,
	userSelectedChat,
	toast,
	setGroupChatName
) => {
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
				chatGroupId,
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

export const searchUserToAddInGroup = async (
	setLoading,
	loggedUser,
	setSearchResults,
	toast,
	search
) => {
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
	} catch (error) {
		toast({
			title: "Error Occured!",
			description: "Failed to fetch the Search Results",
			status: "error",

			duration: 3000,
			isClosable: true,
			position: "bottom-left",
		});
	} finally {
		setLoading(false);
	}
};

export const leaveGroup = async (
	loggedUser,
	chatGroupId,
	dispatch,
	userSelectedChat,
	setFetchAgain,
	fetchAgain,
	toast
) => {
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUser.token}`,
			},
		};
		await axios.put(
			`/api/v1/leavegroup`,
			{
				chatGroupId,
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
