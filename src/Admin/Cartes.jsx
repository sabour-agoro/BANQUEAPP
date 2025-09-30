import { useEffect, useState } from "react"; 
import { getAllCartes, changeCartePassword, deleteCarte } from "../Api";

function Cartes() {
  const [cartes, setCartes] = useState([]);
  const [filterType, setFilterType] = useState(null);

  // États pour modification mot de passe
  const [selectedCarteId, setSelectedCarteId] = useState(null);
  const [AncienPassword, setAncienPassword] = useState("");
  const [NouveauPassword, setNouveauPassword] = useState("");

  const token = localStorage.getItem("token");

  const fetchCartes = async () => {
    try {
      const response = await getAllCartes(filterType);
      if (response.ok) {
        setCartes(response.result);
      }
    } catch (err) {
      console.error("Erreur récupération cartes :", err);
    }
  };

  useEffect(() => {
    fetchCartes();
  }, [filterType]);

  const handleChangePassword = async () => {
    if (!selectedCarteId || !AncienPassword || !NouveauPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const payload = {
        carte_id: selectedCarteId,
        old_password: AncienPassword,
        new_password: NouveauPassword,
      };
      const response = await changeCartePassword(payload, token);
      if (response.ok) {
        alert("Mot de passe modifié avec succès !");
        setSelectedCarteId(null);
        setAncienPassword("");
        setNouveauPassword("");
        fetchCartes();
      } else {
        alert(response.error || "Erreur lors du changement de mot de passe.");
      }
    } catch (err) {
      console.error("Erreur modification mot de passe :", err);
    }
  };

  const handleDeleteCarte = async (carteId) => {
    const pwd = prompt("Entrez le mot de passe de la carte à supprimer :");
    if (!pwd) return;
    try {
      const response = await deleteCarte(carteId, pwd, token);
      if (response.ok) {
        alert("Carte supprimée !");
        fetchCartes();
      } else {
        alert(response.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression carte :", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-green-400">Toutes les cartes (Banque)</h1>

      {/* Filtre par type */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-green-300 font-medium">Filtrer par type :</label>
        <select
          value={filterType || ""}
          onChange={(e) => setFilterType(e.target.value || null)}
          className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Toutes</option>
          <option value="visa">Visa</option>
          <option value="mastercard">Mastercard</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* Liste des cartes */}
      <ul className="mb-6">
        {cartes.length > 0 ? (
          cartes.map((carte) => (
            <li key={carte.id_carte} className="border border-gray-700 p-4 rounded-lg mb-3 hover:bg-gray-800 transition-colors">
              <p><strong>ID Carte:</strong> {carte.id_carte}</p>
              <p><strong>Numéro:</strong> {carte.numero_carte}</p>
              <p><strong>Type:</strong> {carte.type_carte}</p>
              <p><strong>Compte ID:</strong> {carte.id_compte}</p>
              <p><strong>Expiration:</strong> {new Date(carte.date_expiration).toLocaleDateString()}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setSelectedCarteId(carte.id_carte)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  Modifier mot de passe
                </button>
                <button
                  onClick={() => handleDeleteCarte(carte.id_carte)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">Aucune carte trouvée.</p>
        )}
      </ul>

      {/* Formulaire modification mot de passe */}
      {selectedCarteId && (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-green-400">Modifier mot de passe</h2>
          <div className="mb-3">
            <label className="block mb-1 text-green-300">Ancien mot de passe</label>
            <input
              type="password"
              value={AncienPassword}
              onChange={(e) => setAncienPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-green-300">Nouveau mot de passe</label>
            <input
              type="password"
              value={NouveauPassword}
              onChange={(e) => setNouveauPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleChangePassword}
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={() => setSelectedCarteId(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cartes;
