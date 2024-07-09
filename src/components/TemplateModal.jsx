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
import { useThemeContext } from './ThemeContext'; 
//https://cold-mailer-back.onrender.com
const TemplateModal = ({ onTemplateCreated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);

  const { colorMode, lightTheme, darkTheme } = useThemeContext();
  const currentTheme = colorMode === 'light' ? lightTheme : darkTheme;

  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [to, setTo] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreateTemplate = async () => {
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('name', templateName);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('body', body);
    formData.append('userId', userId);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('https://cold-mailer-back.onrender.com/api/templates', {
        method: 'POST',
        body: formData,
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
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
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
            <FormControl mt={4}>
              <FormLabel>Attachment (Optional)</FormLabel>
              <Input type="file" onChange={handleFileChange} />
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
