import React from 'react';
import { Image, keyframes, useColorMode } from '@chakra-ui/react';

import { ChakraProvider, Box, Container, Heading, Text, Button, SimpleGrid, HStack, List, ListItem, ListIcon, IconButton, Link,Icon,Flex } from '@chakra-ui/react';
import { FaCheckCircle, FaEnvelope, FaChartLine, FaNode, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { FaGithub, FaCode } from 'react-icons/fa';
import { ThemeProvider } from './ThemeContext'; 

import Navbar from './Navbar';
const animationKeyframes = keyframes`
  0% { transform: scale(1); }
  
  100% { transform: scale(1.2); }
`;

const animation = `${animationKeyframes} 0.5s forwards`;


const HeroSection = () => {
  const { colorMode } = useColorMode(); 
  const bgColor = colorMode === "dark" ? "black" : "gray.600";


  return (
  <Box id="home" position="relative" py={{ base: 20, md: 80 }} px={0} overflow="hidden">
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="-1"
      filter="blur(12px)"
      paddingBottom="57%"  
    >
      <iframe
        src="https://giphy.com/embed/kcmyqwqNg3OzcYDL6T"
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 , border:0 }}
        className="giphy-embed"
        allowFullScreen
      ></iframe>
    </Box>
    {/* Dark Overlay */}
    <Box 
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg={bgColor}
      opacity="0.5"
      zIndex="-1"
    ></Box>
    <Container maxW="container.lg" textAlign={{ base: 'left', md: 'center' }} color="white">
      <Heading as="h1" size={{ base: 'lg', md: '2xl' }} mb={4}>Streamline Your Email Campaigns</Heading>
      <Text fontSize={{ base: 'md', md: 'xl' }} mb={8}>Plan, Schedule, and Track Your Emails with Ease</Text>
      <Link href="/main">
        <Button colorScheme="teal" size="lg">Get Started <ArrowForwardIcon boxSize={6}/></Button>
      </Link>
    </Container>
  </Box>
);
};

const FeaturesSection = () => {
  const { colorMode } = useColorMode(); 

  return (
    <Box id="about" p={60} bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'} color={colorMode === 'dark' ? 'whiteAlpha.900' : 'black'}>
      <Heading as="h2" size="xl" textAlign="center" mb={8}>How It Works</Heading>
      <Container maxW="container.lg">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box
            
            _hover={{
              animation: animation,
            }}
            boxShadow="dark-lg"
            p="10"
            rounded="md"
            textAlign="center"
          >
            <FaEnvelope size={40} color="teal.500" />
            <Heading as="h3" size="md" mt={4}>
              Email Scheduling
            </Heading>
            <Text mt={2}>Easily schedule emails to be sent at the right time.</Text>
          </Box>
          <Box
            transition="transform 0.2s"
            _hover={{
              animation: animation,
            }}
            boxShadow="dark-lg"
            p="10"
            rounded="md"
            textAlign="center"
          >
            <FaChartLine size={40} color="teal.500" />
            <Heading as="h3" size="md" mt={4}>
              Performance Tracking
            </Heading>
            <Text mt={2}>Track the status and performance of your email campaigns.</Text>
          </Box>
          <Box
            transition="transform 0.2s"
            _hover={{
              animation: animation,
            }}
            boxShadow="dark-lg"
            p="10"
            rounded="md"
            textAlign="center"
          >
            <FaNode size={40} color="teal.500" />
            <Heading as="h3" size="md" mt={4}>
              Interactive Flowcharts
            </Heading>
            <Text mt={2}>Create and manage your email workflows visually.</Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
const ExampleSection = () => {
//   const { colorMode } = useColorMode(); 
//   return (
//     <Box py={16} bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'} color={colorMode === 'dark' ? 'whiteAlpha.900' : 'black'}>
//       <Container maxW="container.lg">
//         <Flex flexDirection={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
//           {/* Example Image (Left Side) */}
//           <Box flex="1" pr={{ base: 0, md: 10 }}>
//             <Image
//               src={colorMode === 'light' ? "ex_l.png" : "ex_d.png"} // Adjust path to your actual image
//               alt="Example Flowchart"
//               borderRadius="md"
//               boxShadow="dark-lg"
//               mb={{ base: 8, md: 0 }}
//             />
//           </Box>
//           {/* Example Description (Right Side) */}
//           <Box flex="1">
//             <Heading as="h2" size="xl" mb={4}>
//               Example Flowchart
//             </Heading>
//             <Text fontSize="lg" mb={6}>
//               This flowchart illustrates how to schedule and track emails seamlessly using our platform. You can easily create, manage, and optimize your email campaigns with our intuitive tools.
//             </Text>
//             <Text fontSize="lg">
//               Start streamlining your email campaigns today!
//             </Text>
//           </Box>
//         </Flex>
//       </Container>
//     </Box>
//   );
// };
const { colorMode } = useColorMode();
const bgColor = colorMode === 'dark' ? 'gray.700' : 'gray.100';

  return (
    <Box pb={60} bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'} color={colorMode === 'dark' ? 'whiteAlpha.900' : 'black'}>
      <Container maxW="container.lg">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
          <Box>
            <Image 
            src={colorMode === 'light' ? "ex_l.png" : "ex_d.png"}
             borderRadius="md" boxShadow="dark-lg" />
          </Box>
          <Box ml={10}>
            
            <Text fontSize="lg" mb={4} color='whiteAlpha'>
              Create, manage, and track your email campaigns effortlessly:
            </Text>
            <List spacing={4} fontSize="lg">
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <strong>Design Flowchart:</strong> Drag & drop nodes to create your campaign.
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <strong>Connect & Customize:</strong> Link nodes and set email details & timings.
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <strong>Save & Schedule:</strong> Save the flowchart to auto-schedule emails.
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <strong>Email Templates:</strong> Create or select templates for quick use.
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                <strong>Track Performance:</strong> Monitor the success of your campaigns in real-time.
              </ListItem>
            </List>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

const TestimonialsSection = () => (
  <Box py={80} >
    <Container maxW="container.lg">
      <Heading as="h2" size="xl" textAlign="center" mb={8}>What Our Users Say..</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Box>
          <Text fontSize="lg" fontStyle="italic">"This tool has revolutionized how we manage our email campaigns. It's incredibly intuitive and powerful."</Text>
          <Text mt={2} fontWeight="bold">- Jane Doe, Marketing Manager</Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontStyle="italic">"We've seen a significant increase in engagement since we started using this flowchart tool. Highly recommend it!"</Text>
          <Text mt={2} fontWeight="bold">- John Smith, Sales Director</Text>
        </Box>
      </SimpleGrid>
    </Container>
  </Box>
);

const PricingSection = () => {
  const { colorMode } = useColorMode(); // Access the current color mode

  return (
  <Box id="pricing" py={60} bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'} color={colorMode === 'dark' ? 'whiteAlpha.900' : 'black'} >
    <Container maxW="container.lg" textAlign="center">
      <Heading as="h2" size="xl" mb={8}>Choose Your Plan...</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Box boxShadow="dark-lg" border="1px"  p={10} borderRadius="md">
          <Heading as="h3" size="lg" mb={4}>Basic</Heading>
          <Text fontSize="2xl" fontWeight="bold">$9/month</Text>
          <Text mt={4}>Basic features for small teams</Text>
          <Button colorScheme="teal" mt={6}>Choose Plan</Button>
        </Box>
        <Box boxShadow="dark-lg" border="1px"  p={6} borderRadius="md">
          <Heading as="h3" size="lg" mb={4}>Pro</Heading>
          <Text fontSize="2xl" fontWeight="bold">$29/month</Text>
          <Text mt={4}>Advanced features for growing teams</Text>
          <Button colorScheme="teal" mt={6}>Choose Plan</Button>
        </Box>
        <Box boxShadow="dark-lg" border="1px"  p={7} borderRadius="md">
          <Heading as="h3" size="lg" mb={4}>Enterprise</Heading>
          <Text fontSize="2xl" fontWeight="bold">$99/month</Text>
          <Text mt={4}>All features for large organizations</Text>
          <Button colorScheme="teal" mt={6}>Choose Plan</Button>
        </Box>
      </SimpleGrid>
    </Container>
  </Box>
);
};
const Developer = () => (
  <Box id="contact" p={60}>
    <Container maxW="container.lg">
      <Heading as="h2" size="xl" textAlign="center" mb={8}>
        Developer
      </Heading>
      <Flex justifyContent="center">
        <Box boxShadow="dark-lg" p={10} rounded="md" textAlign="center" >
          <Image
            src="dev.jpeg"
            alt="Developer Photo"
            borderRadius="full"
            boxSize="25vh"
            transition="transform 0.2s"
            _hover={{
              animation: animation,
            }}
          />
          <Text fontSize="2xl"  mt={4}>
            Unique Panghal
          </Text>
          <HStack justifyContent="center" spacing={5} mt={4}>
            <Link href="https://github.com/panghal007" isExternal>
              <Icon as={FaGithub} boxSize={6} />
            </Link>
            <Link href="https://www.linkedin.com/in/uniquepanghal/" isExternal>
              <Icon as={FaLinkedin} boxSize={6} />
            </Link>
            <Link href="https://leetcode.com/tech_qnui/" isExternal>
              <Icon as={FaCode} boxSize={6} />
            </Link>
          </HStack>
        </Box>
      </Flex>
    </Container>
  </Box>
);

const Footer = () => (
  <Box py={6} bg="gray.900" color="white">
    <Container maxW="container.lg" display="flex" justifyContent="center" alignItems="center" borderBottom="1px" borderColor="gray.700" pb={4} mb={4}>
      <Text fontSize="lg" fontWeight="bold">&copy; {new Date().getFullYear()} Cold Mailer. All rights reserved. 🇮🇳</Text>
    </Container>
    <Container maxW="container.lg" display="flex" justifyContent="center" alignItems="center">
      <Text fontSize="md" color="gray.400">This is a beta product. The final version will be published soon. </Text>
    </Container>
    <Container maxW="container.lg" display="flex" justifyContent="center" alignItems="center" mt={4}>
      <Text fontSize="sm" color="gray.500">-  Unique Panghal 👑</Text>
    </Container>
  </Box>
);


const LandingPage = () => (
  <ThemeProvider>
    <Navbar  />
    <HeroSection />
    <FeaturesSection />
    <ExampleSection />
    <TestimonialsSection />
    <PricingSection />
    <Developer />
    <Footer />
    </ThemeProvider>
);

export default LandingPage;
