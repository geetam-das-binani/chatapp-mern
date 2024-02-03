import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	IconButton,
	Button,
	Image,
	Text,
} from "@chakra-ui/react";

import { ViewIcon } from "@chakra-ui/icons";
const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton d={{ base: "none" }} icon={<ViewIcon />} onClick={onOpen} />
			)}
			<Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent height="410px">
					<ModalHeader
						fontSize="40px"
						fontFamily="Work sans"
						display="flex"
						justifyContent="center"
					>
						{user?.name ?? ""}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDir="column"
						alignItems="center"
						justifyContent="center"
					>
						<Image
							borderRadius="full"
							boxSize="150px"
							src={user?.pic ?? ""}
							alt={user?.name ?? "user-image"}
						/>
						<Text fontFamily="Work sans" fontSize="20px">
							Email:{user?.email ?? ""}
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="red" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
