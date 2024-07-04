import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import { Link as ScrollLink } from 'react-scroll';

const Links = ['Home', 'About', 'Pricing', 'Contact'];

const NavLink = ({ children }) => (
  <ScrollLink
    to={children.toLowerCase()}
    smooth={true}
    duration={500}
    spy={true}
    exact="true"
    offset={0}
  >
    <Box
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
        cursor: 'pointer'
      }}
    >
      {children}
    </Box>
  </ScrollLink>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const cancelRef = React.useRef();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    onAlertClose();
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: !isOpen ? 'none' : 'inherit' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box onClick={handleLogoClick}>
            <img
              src={colorMode === 'light' ? "logo.png" : "logo_dark.png"}
              alt="Logo"
              style={{ height: '50px', width: 'auto', cursor: 'pointer' }}
            />
          </Box>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}
          >
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Button onClick={toggleColorMode} mr={4}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button
            variant={'solid'}
            colorScheme={'teal'}
            size={'sm'}
            mr={4}
            onClick={isLoggedIn ? onAlertOpen : handleSignIn}
          >
            {isLoggedIn ? 'Log out' : 'Sign in'}
          </Button>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="xl" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>

            <AlertDialogBody>
            Mat kar bhai ro dunga 🥺
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Log out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Navbar;
