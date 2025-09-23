import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Admin/Register.jsx';

function App() {
 

  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Register" />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App
