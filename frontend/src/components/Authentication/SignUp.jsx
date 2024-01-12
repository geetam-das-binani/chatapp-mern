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
const SignUp = () => {
	const navigate=useNavigate()
	const [userCredentials, setUserCredentials] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [pic, setPic] = useState("");
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const handleClick = () => setShow(!show);

	const handleChange = (e) => {
		setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
	};
	const submitHandler = async () => {
		if (
			!userCredentials.name ||
			!userCredentials.email ||
			!userCredentials.password ||
			!userCredentials.confirmPassword
		) {
			toast({
				title: "Error",
				description: "All fields are required",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
			return;
		}
		if (userCredentials.password !== userCredentials.confirmPassword) {
			toast({
				title: "Error",
				description: "Passwords do not match",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
			return;
		}

		try {
			setLoading(true);
			const formData = new FormData();
			formData.set("name", userCredentials.name);
			formData.set("email", userCredentials.email);
			formData.set("password", userCredentials.password);
			formData.set("pic", pic);
			const config = {
				headers: { "Content-Type": "multipart/form-data" }
				
			};
			// const { data } = await axios.post("http://localhost:8000/api/v1/register", formData, config);
			const { data } = await axios.post("/api/v1/register", formData, config);
			
			localStorage.setItem('user',JSON.stringify(data))
			toast({
				title: "Success",
                description: 'Registered Successfully',
                status: "success",
                duration: 9000,
                isClosable: true,
			})
			navigate('/chats')
		} catch (error) {
			toast({
				title: "Error",
				description: `${error.message}`,
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
			<FormControl id="first-name" isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder="Enter your name"
					onChange={handleChange}
					value={userCredentials.name}
					name="name"
				/>
			</FormControl>
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
			<FormControl
				id="confirm-password
            "
				isRequired
			>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup>
					<Input
						placeholder="Confirm password"
						onChange={handleChange}
						type={show ? "text" : "password"}
						value={userCredentials.confirmPassword}
						name="confirmPassword"
					/>
					<InputRightElement>
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl>
				<FormLabel>Upload Your Picture</FormLabel>

				<Input
					onChange={(e) => setPic(e.target.files[0])}
					type="file"
					accept="image/**"
					name="pic"
				/>
				<Button
					colorScheme="blue"
					width="100%"
					style={{ marginTop: 15 }}
					onClick={submitHandler}
					isLoading={loading}
				>
					Sign Up
				</Button>
			</FormControl>
		</VStack>
	);
};

export default SignUp;
