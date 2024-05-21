import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlowChart from './components/FlowChart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
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
  );
}

export default App;
