import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./Admin/Register.jsx"; 
import Comptes from "./Admin/Comptes.jsx";        
import UserLogin from "./Client/User_login.jsx"; 
import User from "./Admin/users.jsx";
import Compte from "./Client/compte.jsx";
import Cartes from "./Admin/Cartes.jsx";
import Carte from "./Client/GetCarte.jsx";
import TransactionPage from "./Client/TransactionsPage.jsx";
import AdminTransactions from "./Admin/AdminTransactions.jsx";
import SimpleTransactionForm from "./Client/SimpleTransactionForm.jsx";
import TransferForm from "./Client/TransferForm.jsx";

function App() {
  return (
    <Router>
      <div>
      
        <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to="/user" style={{ marginRight: "10px" }}>Users</Link>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/comptes" style={{ marginRight: "10px" }}>Comptes</Link>
          <Link to="/compte" style={{ marginRight: "10px" }}>Créer un compte</Link>
          <Link to="/Cartes" style={{ marginRight: "10px" }}>Les cartes </Link>
          <Link to="/Carte"  style={{ marginRight: "10px" }}>Mes cartes </Link>
        </header>

       
        <main style={{ padding: "10px" }}>
          <Routes>
        
            <Route path="/" element={<Navigate to="/register" />} />

            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/comptes" element={<Comptes />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/Cartes" element={<Cartes />} />
            <Route path="/Carte" element={<Carte />} />

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
