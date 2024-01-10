import React, { useState } from "react";
import {
	FormControl,
	FormLabel,
	VStack,
	Input,
	InputGroup,
	Button,
	InputRightElement,
} from "@chakra-ui/react";
const SignUp = () => {
	const [userCredentials, setUserCredentials] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [pic, setPic] = useState("");
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handleChange = (e) => {
		setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
	};
	const submitHandler = () => {
		console.log(userCredentials);
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
				>Sign Up</Button>
			</FormControl>
		</VStack>
	);
};

export default SignUp;
