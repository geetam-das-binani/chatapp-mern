import React from "react";
import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import SideDrawer from "../miscellaneous/SideDrawer";
import MyChats from "../miscellaneous/MyChats.jsx";
import ChatBox from "../miscellaneous/ChatBox.jsx";
const ChatPage = () => {
	const { user } = useSelector((state) => state.user);
	return (
		<div
			style={{
				width: "100%",
			}}
		>
			{user && <SideDrawer />}
			<Box
				display="flex"
				justifyContent="space-between"
				height="91.5vh"
				p="10px"
				w="100%"
			>
				{user && <MyChats />}

				{user && <ChatBox />}
			</Box>
		</div>
	);
};

export default ChatPage;
