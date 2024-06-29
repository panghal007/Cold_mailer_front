import React, { useState } from 'react';
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useThemeContext } from './ThemeContext'; // Adjust the path as necessary


const TemplateModal = ({ onTemplateCreated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);

  const { colorMode, lightTheme, darkTheme } = useThemeContext();
  const currentTheme = colorMode === 'light' ? lightTheme : darkTheme;

  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [to, setTo] = useState('');

  const [body, setBody] = useState('');

  const handleCreateTemplate = async () => {
    const newTemplate = {
      name: templateName,
      to,
      subject,
      body,
    };

    try {
      const response = await fetch('https://cold-mailer-back.onrender.com/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      });

      if (response.ok) {
        onTemplateCreated();
        onClose();
      } else {
        console.error('Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  return (
    <>
      <Button bg={currentTheme.nodeBg} color={currentTheme.nodeColor} onClick={onOpen}>Create Template</Button>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Template Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>To</FormLabel>
              <Input
                placeholder="alex@gamil.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Subject</FormLabel>
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Body</FormLabel>
              <Textarea
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateTemplate}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TemplateModal;
