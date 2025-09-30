import { useState } from "react";
import { loginUser } from "../Api.jsx";

function UserLogin() {
  const [formData, setFormData] = useState({
    nom_user: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
       const response = await loginUser(formData);
       console.log("Réponse brute du login :", response);

      if (response && response.result && response.result.access_token) {
        localStorage.setItem("token", response.result.access_token);
        console.log("Connexion réussie :", response);
        setMessage("Connexion réussie !");
      

      } else {
      
        setMessage("Erreur de connexion : le format de la réponse est invalide.");
        console.error("Erreur de connexion :", response);
      }
    } catch (error) {
     
      console.error("Erreur de connexion :", error);
      setMessage("Échec de la connexion : " + (error.response?.data?.detail || "Vérifiez vos identifiants."));
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800 text-white">
      {message && (
        <div
          className={`absolute top-4 p-4 rounded-md text-sm font-medium ${
            message.includes("Échec") || message.includes("Erreur")
              ? "bg-red-500"
              : "bg-green-500"
          }`}
        >
          {message}
        </div>
      )}

      <div className="w-full max-w-md p-6 bg-slate-900 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-200">
          Connexion Client
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nom_user"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Nom utilisateur
            </label>
            <input
              type="text"
              id="nom_user"
              name="nom_user"
              value={formData.nom_user}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Email de connexion :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Mot de passe :
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;