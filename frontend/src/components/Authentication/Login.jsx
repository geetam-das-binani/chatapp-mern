import React, { useEffect, useState } from "react";
import {
	FormControl,
	FormLabel,
	VStack,
	Input,
	InputGroup,
	Button,
	InputRightElement,
	useToast,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { handleLoginUser } from "../../actions/userActions";

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const toast = useToast();

	const [userCredentials, setUserCredentials] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);

	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handleChange = (e) => {
		setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
	};
	const submitHandler = async () => {
		if (!userCredentials.email || !userCredentials.password) {
			toast({
				title: "Error",
				description: "All fields are required ",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setLoading(true);
		handleLoginUser(
			dispatch,
			toast,
			userCredentials.email,
			userCredentials.password,
			setLoading
		);
	};

	useEffect(() => {
		if (user) navigate("/chats");
	}, [user]);

	return (
		<VStack spacing="5px">
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder="Enter your email"
					onChange={handleChange}
					name="email"
					value={userCredentials.email}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						placeholder="Enter your password"
						type={show ? "text" : "password"}
						onChange={handleChange}
						name="password"
						value={userCredentials.password}
					/>
					<InputRightElement>
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>{" "}
			<FormControl>
				<Button
					colorScheme="blue"
					width="100%"
					style={{ marginTop: 15 }}
					onClick={submitHandler}
					isLoading={loading}
				>
					Login{" "}
				</Button>
				<Button
					colorScheme="red"
					width="100%"
					style={{ marginTop: 15 }}
					onClick={() =>
						setUserCredentials({
							email: "geetambinani6@gmail.com",
							password: "123456",
						})
					}
				>
					Get Guest User Credentials{" "}
				</Button>
			</FormControl>
		</VStack>
	);
};

export default Login;
