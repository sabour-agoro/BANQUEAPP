import { useState, useEffect } from "react";
import {
  getUsers,
  updateUser,
  getUserByEmail,
  getUserById,
  deleteUserById,
} from "../Api.jsx"; 

function User({ token }) {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [editEmail, setEditEmail] = useState("");
  const [editData, setEditData] = useState({
    nom_user: "",
    email: "",
    adresse: "",
    date_naissance: "",
    role: "",
    id_banque: "",
  });

 
  const effectiveToken = token || localStorage.getItem("token");

  useEffect(() => {
    
    fetchUsers();
   
  }, [effectiveToken]);

  
  const normalizeToList = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    
    if (response.result !== undefined) {
      if (Array.isArray(response.result)) return response.result;
      if (response.result && typeof response.result === "object") return [response.result];
    }
    
    if (typeof response === "object") return [response];
    return [];
  };

  const extractErrorMessage = (err) => {
    
    if (!err) return "Erreur inconnue";
    
    if (err.detail) {
      if (Array.isArray(err.detail)) {
        return err.detail.map((d) => d.msg || JSON.stringify(d)).join(" ; ");
      }
      return String(err.detail);
    }
    if (err.error) return String(err.error);
    if (err.message) return String(err.message);
   
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setMessage("");
    if (!effectiveToken) {
      setIsLoading(false);
      setMessage("Jeton manquant — veuillez vous connecter.");
      return;
    }

    try {
      const response = await getUsers(effectiveToken);
      console.debug("getUsers response:", response);
      const list = normalizeToList(response);
      if (list.length === 0) {

        if (response && response.ok === false) {
          setMessage(response.error || "Aucun utilisateur disponible");
          setUsers([]);
        } else {
          setUsers([]);
          setMessage(""); 
        }
      } else {
        setUsers(list);
        setMessage("");
      }

    } catch (err) {
      console.error("fetchUsers error:", err);
      setMessage("Erreur de récupération des utilisateurs : " + extractErrorMessage(err));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      fetchUsers();
      return;
    }
    setIsLoading(true);
    setMessage("");
    if (!effectiveToken) {
      setIsLoading(false);
      setMessage("Jeton manquant — veuillez vous connecter.");
      return;
    }

    try {
      const response = await getUserByEmail(searchEmail.trim(), effectiveToken);
      console.debug("getUserByEmail response:", response);
      const list = normalizeToList(response);
      if (list.length === 0) {
        setUsers([]);
        setMessage("Aucun utilisateur trouvé.");
      } else {
        setUsers(list);
      }
    } catch (err) {
      console.error("handleSearch error:", err);
      setMessage("Erreur lors de la recherche : " + extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editEmail) {
      setMessage("Veuillez entrer l'email d'un utilisateur à modifier");
      return;
    }
    if (!effectiveToken) {
      setMessage("Jeton manquant — veuillez vous connecter.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await updateUser(editEmail, editData, effectiveToken);
      console.debug("updateUser response:", response);
      if (response && response.ok === false) {
        setMessage(response.error || "Échec de la mise à jour");
      } else {
        setMessage("Utilisateur mis à jour avec succès");
        fetchUsers();
        
      }
    } catch (err) {
      console.error("handleUpdate error:", err);
      setMessage("Erreur lors de la mise à jour : " + extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetById = async (id) => {
    if (!effectiveToken) {
      setMessage("Jeton manquant — veuillez vous connecter.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await getUserById(id, effectiveToken);
      console.debug("getUserById response:", response);
      const list = normalizeToList(response);
      setUsers(list);
    } catch (err) {
      console.error("handleGetById error:", err);
      setMessage("Erreur lors de la lecture : " + extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    if (!effectiveToken) {
      setMessage("Jeton manquant — veuillez vous connecter.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await deleteUserById(id, effectiveToken);
      console.debug("deleteUserById response:", response);
      if (response && response.ok === false) {
        setMessage(response.error || "Échec de la suppression");
      } else {
        setMessage("Utilisateur supprimé avec succès");
        fetchUsers();
      }
    } catch (err) {
      console.error("handleDelete error:", err);
      setMessage("Erreur lors de la suppression : " + extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-500">
        Gestion des Utilisateurs
      </h2>

      {message && (
        <div className="mb-4 p-3 bg-gray-800 border border-green-500 rounded-lg text-sm">
          {message}
        </div>
      )}

    
      <div className="flex gap-2 mb-6 max-w-lg">
        <input
          type="text"
          placeholder="Rechercher par email"
          className="flex-1 p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-black px-4 py-2 rounded-md hover:bg-green-700"
        >
          Rechercher
        </button>
        <button
          onClick={fetchUsers}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Rafraîchir
        </button>
      </div>

      {/* Formulaire Update */}
      <div className="mb-6 bg-gray-900 p-4 rounded-lg shadow border border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-green-400">
          Mettre à jour un utilisateur
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Email cible"
            className="p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nom"
            className="p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
            value={editData.nom_user}
            onChange={(e) => setEditData({ ...editData, nom_user: e.target.value })}
          />
          <input
            type="text"
            placeholder="Adresse"
            className="p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
            value={editData.adresse}
            onChange={(e) => setEditData({ ...editData, adresse: e.target.value })}
          />
          <input
            type="date"
            placeholder="Date de naissance"
            className="p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
            value={editData.date_naissance}
            onChange={(e) =>
              setEditData({ ...editData, date_naissance: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Rôle"
            className="p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
            value={editData.role}
            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
          />
          <input
            type="number"
            placeholder="ID Banque"
            className="p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
            value={editData.id_banque}
            onChange={(e) =>
              setEditData({ ...editData, id_banque: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleUpdate}
          className="mt-3 bg-green-600 text-black px-4 py-2 rounded-md hover:bg-green-700"
        >
          Mettre à jour
        </button>
      </div>

      {/* Tableau utilisateurs */}
      {isLoading ? (
        <p className="text-green-400">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
            <thead>
              <tr className="text-green-500">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Adresse</th>
                <th className="p-3 text-left">Date Naissance</th>
                <th className="p-3 text-left">Rôle</th>
                <th className="p-3 text-left">ID Banque</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id_user} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="p-3">{u.id_user}</td>
                    <td className="p-3">{u.nom_user}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.adresse}</td>
                    <td className="p-3">{u.date_naissance}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.id_banque}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleGetById(u.id_user)}
                        className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 text-white"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDelete(u.id_user)}
                        className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 text-white"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-3 text-gray-400 text-center">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default User;
