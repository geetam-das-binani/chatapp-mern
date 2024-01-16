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
import { useSelector } from "react-redux";
import { ViewIcon } from "@chakra-ui/icons";
const ProfileModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user: loggedUser } = useSelector((state) => state.user);

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
						{loggedUser.user.name}
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
							src={loggedUser.user.pic}
							alt={loggedUser.user.name}
						/>
						<Text fontFamily="Work sans" fontSize="20px">
							Email:{loggedUser.user.email}
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button variant="ghost">Secondary Action</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
