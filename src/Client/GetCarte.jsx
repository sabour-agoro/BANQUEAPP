import { useEffect, useState } from "react"; 
import { getUserCartes, createCarte } from "../Api";
import { useNavigate } from "react-router-dom";

function Carte() {
  const [cartes, setCartes] = useState([]);
  const [carteType, setCarteType] = useState("visa");
  const [password, setPassword] = useState("");
  const [accountId, setAccountId] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCartes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      const response = await getUserCartes(null, user.account_id, token);
      if (response.ok) {
        setCartes(response.result);
      }
    } catch (err) {
      console.error("Erreur récupération cartes client :", err);
    }
  };

  useEffect(() => {
    fetchCartes();
  }, []);

  const handleCreateCarte = async () => {
    if (!accountId || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const payload = { account_id: accountId, carte_type: carteType, password };
      const response = await createCarte(payload, token);
      if (response.ok) {
        alert("Carte créée avec succès !");
        fetchCartes();
      } else {
        alert(response.error || "Erreur lors de la création de la carte.");
      }
    } catch (err) {
      console.error("Erreur création carte :", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">Mes cartes</h1>

      {/* Liste des cartes */}
      <ul className="mb-8 space-y-4">
        {cartes.length > 0 ? (
          cartes.map((carte) => (
            <li
              key={carte.id_carte}
              className="border border-gray-700 p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <p><span className="font-semibold text-green-400">Numéro:</span> {carte.numero_carte}</p>
              <p><span className="font-semibold text-green-400">Type:</span> {carte.type_carte}</p>
              <p>
                <span className="font-semibold text-green-400">Expiration:</span>{" "}
                {new Date(carte.date_expiration).toLocaleDateString()}
              </p>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">Aucune carte trouvée.</p>
        )}
      </ul>

      {/* Formulaire création carte */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Créer une nouvelle carte</h2>
        <div className="mb-4">
          <label className="block mb-1">Compte ID</label>
          <input
            type="number"
            value={accountId}
            onChange={(e) => setAccountId(Number(e.target.value))}
            className="w-full border border-gray-600 p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Type de carte</label>
          <select
            value={carteType}
            onChange={(e) => setCarteType(e.target.value)}
            className="w-full border border-gray-600 p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-600 p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleCreateCarte}
          className="w-full bg-green-600 hover:bg-green-700 text-black font-semibold py-3 rounded-lg transition-colors"
        >
          Créer carte
        </button>
      </div>
    </div>
  );
}

export default Carte;
