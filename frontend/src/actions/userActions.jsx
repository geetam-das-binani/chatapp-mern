import axios from "axios";
import { loginUser, registerUser } from "../Reducers/userReducer";
export const handleLoginUser = async (
	dispatch,
	toast,
	email,
	password,
	setLoading
) => {
	try {
		const config = {
			headers: { "Content-Type": "application/json" },
		};
		const { data } = await axios.post(
			"/api/v1/login",
			{ email, password },
			config
		);
		dispatch(loginUser(data));
		toast({
			title: "Success",
			description: "Login Success",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
	} catch (error) {
		toast({
			title: "Error",
			description: `${error.response.data.message}`,
			status: "error",
			duration: 3000,
			isClosable: true,
		});
	} finally {
		setLoading(false);
	}
};

export const handleRegisterUser = async (
	dispatch,
	toast,
	formData,
	setLoading
) => {
	try {
		const config = {
			headers: { "Content-Type": "multipart/form-data" },
		};
		const { data } = await axios.post("/api/v1/register", formData, config);
		dispatch(registerUser(data));
		toast({
			title: "Success",
			description: "Registered Successfully",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
	} catch (error) {
		toast({
			title: "Error",
			description: `${error.response.data.message}`,
			status: "error",
			duration: 3000,
			isClosable: true,
		});
	} finally {
		setLoading(false);
	}
};
