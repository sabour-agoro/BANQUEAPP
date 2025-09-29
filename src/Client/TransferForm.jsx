import React, { useState } from "react";
import { doTransfert } from "../Api";

export default function TransferForm({ defaultAccountId }) {
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    account_id: defaultAccountId || "",
    amount: "",
    destinator_num_compte: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Erreur de connexion : vous n'êtes pas authentifié.");
      return;
    }

    if (!formData.account_id) {
      setMessage("Erreur : ID de compte source non chargé.");
      return;
    }

    // validation simple côté client
    if (!formData.destinator_num_compte || !formData.amount) {
      setMessage("Veuillez remplir tous les champs requis.");
      return;
    }

    setIsSubmitting(true);
    try {
      // doTransfert devrait retourner un objet { ok: boolean, detail?: string } ou une Response
      const response = await doTransfert(formData, token);

      // cas où doTransfert renvoie un objet personnalisé
      if (response && typeof response === "object" && !response instanceof Response) {
        if (response.ok) {
          setMessage("Transfert réussi !");
          setFormData({ account_id: defaultAccountId || "", amount: "", destinator_num_compte: "" });
        } else {
          const detail = response.detail || response.message || "Veuillez vérifier les montants.";
          setMessage("Erreur de transfert : " + detail);
        }
      } else if (response instanceof Response) {
        // si doTransfert renvoie une Response (fetch)
        if (response.ok) {
          setMessage("Transfert réussi !");
          setFormData({ account_id: defaultAccountId || "", amount: "", destinator_num_compte: "" });
        } else {
          let detail = "Veuillez vérifier les montants.";
          try {
            const payload = await response.json();
            detail = payload.detail || payload.message || detail;
          } catch (err) {
            // ignore JSON parse errors
          }
          setMessage("Erreur de transfert : " + detail);
        }
      } else {
        // retour inattendu
        setMessage("Échec du transfert. Réessayez.");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setMessage("Échec du transfert. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 bg-gray-900 min-h-[60vh]">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-2xl text-white">
        {/* message d'état */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`p-3 mb-4 rounded font-medium ${getMessageClass(message)}`}
          >
            {message}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Effectuer un transfert</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Compte source affiché (lecture seule) */}
          <div className="p-3 bg-gray-700 border border-green-500 rounded-lg text-sm font-medium text-white">
            Compte source utilisé : {formData.account_id || "(non défini)"}
          </div>

          <input type="hidden" name="account_id" value={formData.account_id} />

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Montant du transfert (€)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-green-500 focus:border-green-500 transition duration-150"
              placeholder="Ex: 500.00"
              step="0.01"
              min="0"
            />
          </div>

          {/* Compte destinataire */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Numéro de compte destinataire</label>
            <input
              type="text"
              name="destinator_num_compte"
              value={formData.destinator_num_compte}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-green-500 focus:border-green-500 transition duration-150"
              placeholder="Saisir le numéro de compte"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md font-semibold transition duration-200 shadow-md text-white disabled:opacity-60"
          >
            {isSubmitting ? "Traitement..." : "Effectuer le transfert"}
          </button>
        </form>
      </div>
    </div>
  );
}

function getMessageClass(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes("erreur") || lower.includes("échec") || lower.includes("invalide") || lower.includes("non chargé")) {
    return "bg-red-800 text-white";
  } else if (lower.includes("réussi") || lower.includes("succès") || lower.includes("mis à jour")) {
    return "bg-green-800 text-white";
  }
  return "bg-gray-700 text-white";
}
