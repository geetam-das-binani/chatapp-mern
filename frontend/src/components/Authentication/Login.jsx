import React, { useState } from "react";
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
import axios from "axios";

import { useNavigate } from "react-router-dom";
const Login = () => {
	const toast = useToast();
	const navigate = useNavigate();
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
				duration: 9000,
				isClosable: true,
			});
			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: { "Content-Type": "application/json" },
			};
			
			
			const { data } = await axios.post(
				"/api/v1/login",
				{ email: userCredentials.email, password: userCredentials.password },
				config
			);

			localStorage.setItem("user", JSON.stringify(data));
			toast({
				title: "Success",
				description: "Login Success",
				status: "success",
				duration: 9000,
				isClosable: true,
			});
			navigate("/chats");
		} catch (error) {
			toast({
				title: "Error",
				description: `${error.response.data.message}`,
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

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
					onClick={()=>setUserCredentials({
						email:"geetambinani6@gmail.com",
						password:"123456"
					})}
				>
					Get Guest User Credentials{" "}
				</Button>
			</FormControl>
		</VStack>
	);
};

export default Login;
