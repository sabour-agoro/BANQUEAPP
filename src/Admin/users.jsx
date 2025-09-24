import { useState, useEffect } from "react";
import { getUsers, getUserByEmail, deleteUserById } from "../Api";

function User() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  // Récupérer tous les utilisateurs
  const fetchUsers = async (token) => {
    setIsLoading(true);
    try {
      const data = await getUsers(token);
      setUsers(data.result);
    } catch (err) {
      console.error("Erreur de récupération des utilisateurs :", err.message);
      setMessage("Erreur de récupération des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };
    useEffect(() => {
    const token = localStorage.getItem("token")
    fetchUsers(token);
  }, []);

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    setIsLoading(true);
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      await deleteUserById(userId, token);
      setMessage("Utilisateur supprimé avec succès");
      fetchUsers(token);
    } catch (err) {
      setMessage("Erreur lors de la suppression : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Rechercher par email
  const handleSearch = async () => {
    if (!searchEmail){
        const token = localStorage.getItem("token");
        return fetchUsers(token);
    } 
    setIsLoading(true);
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const user = await getUserByEmail(searchEmail, token);
      if (user) {
        setUsers([user]);
      } else {
        setUsers([]);
        setMessage("Aucun utilisateur trouvé avec cet email");
      }
    } catch (err) {
      setMessage("Erreur lors de la recherche : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-500">
        Gestion des clients
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-gray-800 border border-green-500 rounded-lg">
          {message}
        </div>
      )}

      {isLoading && <div className="text-green-400 mb-4">Chargement...</div>}

      {/* Recherche par email */}
      <div className="flex gap-2 mb-6 max-w-lg">
        <input
          type="email"
          placeholder="Rechercher par email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="flex-1 p-2 rounded-md bg-black border border-gray-600 focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-black px-4 py-2 rounded-md hover:opacity-80"
        >
          Rechercher
        </button>
      </div>

      {/* Tableau utilisateurs */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
          <thead>
            <tr className="text-green-500">
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Adresse</th>
              <th className="p-3 text-left">Date Naissance</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id_user} className="border-t border-gray-700">
                  <td className="p-3">{user.nom_user}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.adresse}</td>
                  <td className="p-3">{user.date_naissance}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteUser(user.id_user)}
                      className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-gray-400" colSpan="6">
                  Aucun client trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
