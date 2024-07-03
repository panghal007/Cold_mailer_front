import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';

const UserDetailsModal = ({ isOpen, onClose, fetchUserProfile,onDetailsSaved }) => {
  const [emailFrom, setEmailFrom] = useState('');
  const [emailPass, setEmailPass] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const toast = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

    try {
      const response = await fetch(`https://cold-mailer-back.onrender.com/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, emailFrom, emailPass }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user details');
      }

      toast({
        title: 'Details saved',
        description: 'Your email details have been saved successfully!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });

      onDetailsSaved(); // Call the callback to update parent state
    } catch (error) {
      console.error('Error saving details:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving your details.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setSubmitting(false);
    }
  };
//     try {
//       const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
//       if (!userId) {
//         throw new Error('User ID not found');
//       }

//       const response = await fetch(`http://localhost:5000/api/profile`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId, // Include userId in the request body
//           emailFrom,
//           emailPass,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to update user profile');
//       }
//       toast({
//         title: 'Profile updated',
//         description: 'User profile details updated successfully.',
//         status: 'success',
//         duration: 4000,
//         isClosable: true,
//         position: 'top',
//       });
//       fetchUserProfile();
//       onClose();
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to update user profile.',
//         status: 'error',
//         duration: 9000,
//         isClosable: true,
//         position: 'top',
//       });
//     }
//   };

return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Email Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>Email From</FormLabel>
            <Input
              placeholder="alex@gmail.com"
              value={emailFrom}
              onChange={(e) => setEmailFrom(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email Password</FormLabel>
            <Input
              placeholder="abcd efgh ijkl mnop"
              type="password"
              value={emailPass}
              onChange={(e) => setEmailPass(e.target.value)}
            />
            <FormHelperText mt={6}>
              <ol>
                <li>Go to your <a href="https://myaccount.google.com/" target="_blank" rel="noopener noreferrer">Google Account</a>.</li>
                <li>Click on "Security".</li>
                <li>Under "Signing in to Google", click "2-Step Verification" and enable it.</li>
                <li>Go back to the "Security" section and click "App passwords".</li>
                <li>Sign in again if prompted.</li>
                <li>Select "Mail" as the app and "Other (Custom name)" as the device, name it, and click "Generate".</li>
                <li>Copy the 16-character password and paste it here.</li>
              </ol>
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isSubmitting}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


export default UserDetailsModal;
