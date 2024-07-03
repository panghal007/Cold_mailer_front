import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link
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
  InputGroup,
  InputRightElement,
  useColorMode,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://cold-mailer-back.onrender.com/api/signup', { email, password });
      console.log(response.data); // Assuming the server sends back a success message
      navigate('/login');
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
    bg={colorMode === 'light' ? 'white' : 'gray.700'} 
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
        boxShadow="dark-lg"
        width="90%"
        mx="auto"
      >
        <Heading as="h2" size="xl" mb={6} textAlign="center" color="teal.500">
          Register
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
              <FormLabel color={colorMode === 'light' ? 'black' : 'black' }>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                color={colorMode === 'light' ? 'black' : 'black' }
                variant="filled"
                _hover={{ bg: 'gray.50' }}
                _focus={{ bg: 'gray.100', borderColor: 'teal.500' }}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel color={colorMode === 'light' ? 'black' : 'black' }>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="filled"
                  color={colorMode === 'light' ? 'white' : 'black' }
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
              isLoading={loading}
              loadingText="Registering..."
            >
              Register
            </Button>
          </VStack>
        </form>
        <Box mt={4} textAlign="center" color={colorMode === 'light' ? 'black' : 'black' }>
          <Link to="/login">Already a user? Login here</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;