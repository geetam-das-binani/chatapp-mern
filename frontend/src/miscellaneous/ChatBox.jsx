import React from "react";
import { Box } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import SingleChat from "../components/SingleChat";
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
	const { selectedChat } = useSelector((state) => state.chat);

	return (
		<Box
			display={{ base: selectedChat._id ? "flex" : "none", md: "flex" }}
			width="100%"
			alignItems="center"
			flexDir="column"
			p={3}
			bg="white"
			w={{ base: "100%", md: "68%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
		</Box>
	);
};

export default ChatBox;
