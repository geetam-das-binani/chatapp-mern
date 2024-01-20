import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UsersListItem = ({ email, name, pic, handleFunction }) => {
	return (
		<Box
			onClick={handleFunction}
			cursor="pointer"
			bg="#E8E8E8"
			_hover={{
				background: "#38B2AC",
				color: "white",
			}}
			w="100%"
			display="flex"
			alignItems="center"
			color="black"
			px={3}
			py={2}
			mb={2}
			borderRadius="lg"
		>
			<Avatar mr={2} size="sm" cursor="pointer" name={name} src={pic} />
			<Box>
				<Text>{name}</Text>
				<Text fontSize="xs">
					<b>Email: {email}</b>
				</Text>
			</Box>
		</Box>
	);
};

export default UsersListItem;
