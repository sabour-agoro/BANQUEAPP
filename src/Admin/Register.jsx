import React, { useState } from "react";
import { registerUser } from "../Api.jsx";

function Register() {
  const [formData, setFormData] = useState({
    nom_user: "",
    email: "",
    adresse: "",
    date_naissance: "",
    password: "",
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

    const payload = { ...formData, id_banque: 1, role: "client" };

    try {
      const response = await registerUser(payload);
      setMessage("Inscription réussie ! Votre identifiant est : " + response.id);
      setFormData({
        nom_user: "",
        email: "",
        adresse: "",
        date_naissance: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        "Erreur d'inscription : " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md">
        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-md text-sm font-medium ${
              message.includes("Erreur") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"
            }`}
          >
            {message}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 text-center text-gray-200">Chargement...</div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-gray-100 text-center">
          Page d'inscription
        </h1>

        <form className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-700" onSubmit={handleSubmit}>
          {[
            { label: "Nom", name: "nom_user", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Adresse", name: "adresse", type: "text" },
            { label: "Date de naissance", name: "date_naissance", type: "date" },
            { label: "Mot de passe", name: "password", type: "password" },
          ].map((field) => (
            <div className="mb-5" key={field.name}>
              <label className="block text-gray-300 font-medium mb-2" htmlFor={field.name}>
                {field.label} :
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-500 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
