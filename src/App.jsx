import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./Admin/Register.jsx"; // Page création client
import User from "./Admin/users.jsx";   // Page gestion utilisateurs

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-gray-200">
        {/* Header navigation */}
        <header className="bg-gray-900 p-4 flex gap-4 border-b border-gray-700">
          <Link
            to="/register"
            className="text-green-500 font-semibold hover:text-green-400"
          >
            Register
          </Link>
          <Link
            to="/user"
            className="text-green-500 font-semibold hover:text-green-400"
          >
            Users
          </Link>
        </header>

        {/* Routes */}
        <main className="p-6">
          <Routes>
            {/* Redirection de / vers /register */}
            <Route path="/" element={<Navigate to="/register" />} />

            {/* Pages */}
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User />} />

            {/* Page 404 */}
            <Route
              path="*"
              element={<div className="text-red-500 text-xl">Page non trouvée</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
