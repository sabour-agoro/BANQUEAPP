import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./Admin/Register.jsx"; // Page création client
import User from "./Admin/users.jsx";        // Page gestion utilisateurs
import UserLogin from "./Client/User_login.jsx"; // Page connexion client

function App() {
  return (
    <Router>
      <div>
        {/* Header navigation */}
        <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to="/user" style={{ marginRight: "10px" }}>Users</Link>
          <Link to="/login">Login</Link>
        </header>

        {/* Routes */}
        <main style={{ padding: "10px" }}>
          <Routes>
            {/* Redirections */}
            <Route path="/" element={<Navigate to="/register" />} />

            {/* Pages */}
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User />} />
            <Route path="/login" element={<UserLogin />} />

            {/* Page 404 */}
            <Route
              path="*"
              element={<div style={{ color: "red" }}>Page non trouvée</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
