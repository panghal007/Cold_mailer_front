import React, { useState } from 'react';
import { Box, Input, Textarea, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const CreateTemplate = ({ onTemplateCreated }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cold-mailer-back.onrender.com/api/templates', {
        name,
        subject,
        body,
      });
      toast({
        title: 'Template created',
        description: 'Your email template has been created.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      onTemplateCreated(response.data.template);
      setName('');
      setSubject('');
      setBody('');
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the template.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mb={3}
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          mb={3}
        />
        <Textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          mb={3}
        />
        <Button type="submit" colorScheme="blue">
          Create Template
        </Button>
      </form>
    </Box>
  );
};

export default CreateTemplate;
