import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Handle } from 'reactflow';

const LeadSourceNode = () => {
  const backgroundColor = useColorModeValue('#f9f9f9', '#1a202c');
  const borderColor = useColorModeValue('#ddd', '#2d3748');
  const textColor = useColorModeValue('#000', '#fff');
  const handleBackground = useColorModeValue('#555', '#cbd5e0');

  const styles = {
    container: {
      padding: 10,
      border: `5px solid ${borderColor}`,
      borderRadius: 20,
      backgroundColor,
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      color: textColor,
    },
    handle: {
      background: handleBackground,
    },
  };

  return (
    <Box {...styles.container}>
      <strong>Lead Source</strong>
      <Handle type="source" position="bottom" style={styles.handle} />
    </Box>
  );
};

export default LeadSourceNode;
