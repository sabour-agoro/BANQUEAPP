import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Admin/Register.jsx';
import UserLogin from './Client/User_login.jsx';

function App() {
 

  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/User_login" />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/User_login" element={<UserLogin />} />
      </Routes>
    </Router>
  );
}

export default App
