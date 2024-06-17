import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlowChart from './components/FlowChart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import { ThemeProvider } from './components/ThemeContext';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

function App() {
  return (
    

    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <FlowChart />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </ThemeProvider>
   

  );
}

export default App;
