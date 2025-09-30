import { createCompte } from "../Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Compte() {
  const [accountType, setAccountType] = useState("epargne");
  const [initial_Amount, setInitial_Amount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCreateCompte = async () => {
    try {
      const payload = {
        account_type: accountType,
        initial_amount: initial_Amount,
      };
      const response = await createCompte(payload, token);
      if (response) {
        navigate("/comptes");
      }
    } catch (error) {
      console.error("Erreur lors de la création du compte :", error);
      alert("Impossible de créer le compte.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-200 p-6">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-green-400 text-center">
          Créer un compte
        </h2>

        {/* Type de compte */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-green-300 mb-1">
            Type de compte
          </label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="epargne">Épargne</option>
            <option value="courant">Courant</option>
          </select>
        </div>

        {/* Dépôt initial */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-green-300 mb-1">
            Dépôt initial
          </label>
          <input
            type="number"
            value={initial_Amount}
            onChange={(e) => setInitial_Amount(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Bouton */}
        <button
          onClick={handleCreateCompte}
          className="w-full bg-green-600 hover:bg-green-700 text-black font-semibold py-3 rounded-lg transition-colors"
        >
          Créer le compte
        </button>
      </div>
    </div>
  );
}

export default Compte;
