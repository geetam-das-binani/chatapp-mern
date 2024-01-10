import React ,{useState}from 'react'
import {
	FormControl,
	FormLabel,
	VStack,
	Input,
	InputGroup,
	Button,
	InputRightElement,
} from "@chakra-ui/react";
const Login = () => {
  const [userCredentials, setUserCredentials] = useState({
		
		email: "",
		password: "",
		
	});
	
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handleChange = (e) => {
		setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
	};
	const submitHndler = () => {
		console.log(userCredentials);
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
        onClick={submitHndler}
      >Login </Button>
          <Button
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={()=>{
          setUserCredentials({email:"geetambinani6@gmail",password:123456789})
        }}
      >Get Guest User Credentials </Button>
    </FormControl>
  </VStack>
  )
}

export default Login
