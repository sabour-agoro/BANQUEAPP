import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllComptes, deleteCompte, getUserByEmail } from "../Api";



function Comptes() {
  const [comptes, setComptes] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  
 
  const fetchComptes = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await getAllComptes();
      if (response.ok) {
        setComptes(response.result);
        setMessage("Comptes chargés avec succès !");
      } else {
        setMessage("Erreur de l'API : " + (response.error || ""));
      }
    } catch (error) {
      setMessage("Erreur de connexion : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

//suppression d'un compte
  const handleDeleteCompte = async (accountId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Erreur : Jeton d'authentification manquant.");
      return;
    }

    setIsLoading(true);
    try {
      await deleteCompte(accountId, token);
      setMessage("Compte supprimé avec succès.");
      fetchComptes(); 
    } catch (error) {
      setMessage("Erreur lors de la suppression : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  //recherche de compte par email
  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Erreur : token manquant");
      return;
    }
    setSearchedUser(null);
    setIsLoading(true);
    try {
      const user = await getUserByEmail(searchEmail, token);
      if (user && user.result){
        setSearchedUser(user.result);
        setMessage("Utilisateur trouvé : " + user.result.nom_user);
      } else{
        setMessage("Aucun utilisateur.");
    }

    } catch (error) {
      setMessage("Erreur lors de la recherche : " + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }

  };
 
  


  useEffect(() => {
    fetchComptes();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-500">
          Gestion des Comptes
        </h1>
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">

        <h2 className="text-xl font-semibold mb-3 text-green-400">
          Rechercher un compte
        </h2>

        <input
          type="email"
          placeholder="Entrez l'email à rechercher"
          
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}

          className="w-full p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
        
        onClick={handleSearch}
        className="mt-3 w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300">
          Rechercher
        </button>
        {searchedUser && (
          <div className="mt-4 p-3 bg-gray-600 rounded-md">
            <h3 className="text-lg font-semibold text-green-300">
             Compte Trouvé :
            </h3>
            <p className="mt-2">
              <span className="font-medium text-gray-200">Nom :</span> {searchedUser.nom_user}
            </p>
            <p>
              <span className="font-medium text-gray-200">Email :</span> {searchedUser.email}
            </p>
            <p>
              <span className="font-medium text-gray-200">ID :</span> {searchedUser.id_user}
            </p>
          </div>
        )}

      </div>
        
        {message && (
          <div className="mb-4 p-3 bg-gray-700 border border-green-500 rounded-lg">
            {message}
          </div>
        )}
        
        {isLoading && <div className="text-green-400 mb-4">Chargement...</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 rounded-lg">
            <thead>
              <tr className="text-green-500">
                <th className="p-3 text-left">ID Compte</th>
                <th className="p-3 text-left">Numéro</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Solde</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comptes.length > 0 ? (
                comptes.map((compte) => (
                  <tr key={compte.id_compte} className="border-t border-gray-700">
                    <td className="p-3">{compte.id_compte}</td>
                    <td className="p-3">{compte.numero_compte}</td>
                    <td className="p-3">{compte.type_compte}</td>
                    <td className="p-3">{compte.solde}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteCompte(compte.id_compte)}
                        className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-gray-400" colSpan="5">
                    Aucun compte trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button
      onClick={handleLogout}
      className="mt-8 w-full py-2 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
      >

        Déconnexion
            
      </button>
    </div>
  );
}

export default Comptes;