import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";
import { Badge, Stack } from "@chakra-ui/react";
const UserBadgeItem = ({ name, handleFunction }) => {
	return (
		<Box
			px={2}
			py={1}
			borderRadius="lg"
			mb={2}
			variant="solid"
			fontSize={12}
			background="#3182ce"
			color="white"
			cursor="pointer"
			onClick={handleFunction}
		>
			{name}
			<CloseIcon pl={1} />
		</Box>
	);
};

export default UserBadgeItem;
