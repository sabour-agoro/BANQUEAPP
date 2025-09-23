import React, { useState } from "react";
import { registerUser } from "./Api.jsx";

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

  // changementss dans les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      id_banque: 1,
      role: "client",
    };

    try {
      const response = await registerUser(payload);
      setMessage(
        "Inscription réussie ! Votre identifiant est : " + response.id
      );

      // Réinitialiser le formulaire
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-noir text-gris-clair p-4">
      {/* Message de succès ou d’erreur */}
      {message && (
        <div
          className={message.includes("Erreur") ? "text-vert" : "text-blanc"}
        >
          {message}
        </div>
      )}

      {/* Loader */}
      {isLoading && <div>Chargement...</div>}

      <h1 className="text-3xl font-bold mb-6 text-vert">
        Page d'inscription
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-noir p-8 rounded-lg shadow-lg w-full max-w-md border border-vert"
      >
        {/* Champ Nom */}
        <div className="mb-4">
          <label
            htmlFor="nom_user"
            className="block text-sm font-medium mb-1"
          >
            Nom :
          </label>
          <input
            type="text"
            id="nom_user"
            name="nom_user"
            value={formData.nom_user}
            onChange={handleChange}
            className="w-full p-2 border border-gris-clair rounded-md focus:outline-none focus:ring-2 focus:ring-vert bg-noir text-blanc"
          />
        </div>

        {/* Champ Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1"
          >
            Email :
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gris-clair rounded-md focus:outline-none focus:ring-2 focus:ring-vert bg-noir text-blanc"
          />
        </div>

        {/* Champ Adresse */}
        <div className="mb-4">
          <label
            htmlFor="adresse"
            className="block text-sm font-medium mb-1"
          >
            Adresse :
          </label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full p-2 border border-gris-clair rounded-md focus:outline-none focus:ring-2 focus:ring-vert bg-noir text-blanc"
          />
        </div>

        {/* Champ Date de naissance */}
        <div className="mb-4">
          <label
            htmlFor="date_naissance"
            className="block text-sm font-medium mb-1"
          >
            Date de naissance :
          </label>
          <input
            type="date"
            id="date_naissance"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
            className="w-full p-2 border border-gris-clair rounded-md focus:outline-none focus:ring-2 focus:ring-vert bg-noir text-blanc"
          />
        </div>

        {/* Champ Mot de passe */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1"
          >
            Mot de passe :
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gris-clair rounded-md focus:outline-none focus:ring-2 focus:ring-vert bg-noir text-blanc"
          />
        </div>

        {/* Bouton d’inscription */}
        <button
          type="submit"
          className="w-full bg-vert text-noir font-bold py-2 px-4 rounded-md hover:opacity-80 transition duration-300"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;
