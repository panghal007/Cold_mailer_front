import React, { createContext, useContext, useState } from 'react';
import { ChakraProvider, extendTheme, useColorMode } from '@chakra-ui/react';

const ThemeContext = createContext();

const lightTheme = {
  bg: '#f0f2f5',
  primary: '#ff0072',
  nodeBg: '#f2f2f5',
  nodeColor: '#222',
  nodeBorder: '#222',
  minimapMaskBg: '#f2f2f5',
  controlsBg: '#ffffff',
  controlsBgHover: '#e2e2e2',
  controlsColor: '#000000',
  controlsBorder: '#d1d1d1',
};

const darkTheme = {
  bg: '#1a202c',
  primary: '#ff0072',
  nodeBg: '#2d3748',
  nodeColor: '#e2e8f0',
  nodeBorder: '#4a5568',
  minimapMaskBg: '#2d3748',
  controlsBg: '#2d3748',
  controlsBgHover: '#4a5568',
  controlsColor: '#ffffff',
  controlsBorder: '#4a5568',
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export const ThemeProvider = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mode, setMode] = useState(colorMode);

  const toggleTheme = () => {
    toggleColorMode();
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ colorMode: mode, toggleTheme, lightTheme, darkTheme }}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
