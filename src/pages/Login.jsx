import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Alert,
  CloseButton,
  useColorModeValue,
  IconButton,
  InputGroup,         // Import InputGroup
  InputRightElement,  // Import InputRightElement
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cold-mailer-back.onrender.com/api/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        maxW="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={8}
        bg="white"
        boxShadow="lg"
        width="90%"
        mx="auto"
      >
        <Heading as="h2" size="xl" mb={6} textAlign="center" color="teal.500">
          Login
        </Heading>
        {error && (
          <Alert status="error" mb={4} rounded="md">
            {error}
            <CloseButton
              onClick={() => setError('')}
              position="absolute"
              right="8px"
              top="8px"
            />
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                variant="filled"
                _hover={{ bg: 'gray.50' }}
                _focus={{ bg: 'gray.100', borderColor: 'teal.500' }}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="filled"
                  _hover={{ bg: 'gray.50' }}
                  _focus={{ bg: 'gray.100', borderColor: 'teal.500' }}
                />
                <InputRightElement width="3rem">
                  <IconButton
                    aria-label="Toggle password visibility"
                    variant="ghost"
                    colorScheme="teal"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="100%"
              mt={4}
              isLoading={false} // You can set this to true while awaiting response
              loadingText="Logging in..."
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
