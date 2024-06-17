import React from 'react';
import { Box, Input, useColorModeValue } from '@chakra-ui/react';
import { Handle } from 'reactflow';

const WaitDelayNode = ({ data, id }) => {
  const backgroundColor = useColorModeValue('#f9f9f9', '#1a202c');
  const borderColor = useColorModeValue('#ddd', '#2d3748');
  const handleBackground = useColorModeValue('#555', '#cbd5e0');
  const textColor = useColorModeValue('#000', '#fff');
  const inputBgColor = useColorModeValue('white', '#2d3748');

  const handleDelayChange = (event) => {
    const delay = event.target.value;
    if (data.onChange) {
      data.onChange(id, delay);
    }
  };

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
    input: {
      
      padding: 10,
      border: `5px solid ${borderColor}`,
      borderRadius: 20,
      backgroundColor: inputBgColor,
      color: textColor,
    },
  };

  return (
    <Box style={styles.container}>
      <Handle type="target" position="top" style={styles.handle} />
      <div>
        <label>Delay (minutes):</label>
        <Input
          type="number"
          value={data.delay}
          onChange={handleDelayChange}
          style={styles.input}
        />
      </div>
      <Handle type="source" position="bottom" style={styles.handle} />
    </Box>
  );
};

export default WaitDelayNode;
