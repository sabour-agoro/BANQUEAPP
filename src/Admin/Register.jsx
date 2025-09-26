import React, { useState } from "react";
import { registerUser, loginUser } from "../Api.jsx";


function Register() {
  const [formData, setFormData] = useState({
    nom_user: "",
    email: "",
    adresse: "",
    date_naissance: "",
    password: "",
    role: "client", 
  });

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const payload = { ...formData, id_banque: 1 };

    try {
      await registerUser(payload);

      setMessage("Inscription réussie !");

      const loginResponse = await loginUser({
        nom_user: formData.nom_user,
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse.token) {
        localStorage.setItem("token", loginResponse.token);
      } else {
        throw new Error("Connexion réussie mais aucun token n'a été reçu.");
      }

     
     
    } catch (error) {
      setMessage(
        "Erreur d'inscription ou de connexion : " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800 text-white p-6">
      <div className="w-full max-w-md">
        {message && (
          <div
            className={`absolute top-4 p-4 rounded-md text-sm font-medium ${
              message.includes("Erreur") ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {message}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 text-center text-slate-200">Chargement...</div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-slate-200 text-center">
          Page d'enregistrement client
        </h1>

        <form
          className="bg-slate-900 p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {[
            { label: "Nom", name: "nom_user", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Adresse", name: "adresse", type: "text" },
            { label: "Date de naissance", name: "date_naissance", type: "date" },
            { label: "Mot de passe", name: "password", type: "password" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label
                className="block text-slate-400 font-medium mb-1"
                htmlFor={field.name}
              >
                {field.label} :
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
          ))}

          <div className="mb-4">
            <label
              className="block text-slate-400 font-medium mb-1"
              htmlFor="role"
            >
              Rôle :
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="client">Utilisateur Standard</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 mt-6"
            disabled={isLoading}
          >
            {isLoading ? "En cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;