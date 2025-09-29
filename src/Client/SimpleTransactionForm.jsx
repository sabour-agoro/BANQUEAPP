import { useState } from "react";
import { doDepot, doRetrait } from "../Api";

// IA Fonction utilitaire pour le CSS (adaptée au thème sombre/vert)
function getMessageClass(msg) {
    if (msg.includes("Erreur") || msg.includes("Échec")) {
        // Fond rouge sombre pour les erreurs
        return "bg-red-800 text-white border border-red-700"; 
    } else if (msg.includes("réussi")) {
        // Fond vert sombre pour le succès
        return "bg-green-800 text-white border border-green-700";
    }
    return "bg-gray-700 text-white border border-gray-600";
}



function SimpleTransactionForm({ transactionType, defaultAccountId }) { 
    
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        
        account_id: defaultAccountId || "",
        amount: "", 
    });

    const formTitle = transactionType === 'depot' ? 'Effectuer un Dépôt' : 'Effectuer un Retrait';
    const actionText = transactionType === 'depot' ? 'Déposer' : 'Retirer';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
            setMessage("Erreur : vous devez être connecté.");
            return; 
        }

        if (!formData.account_id) {
            setMessage("Erreur : ID de compte source non chargé.");
            return;
        }
        
        try {
            let response;
            
            if (transactionType === 'depot') {
                response = await doDepot(formData, token);
            } else if (transactionType === 'retrait') {
                response = await doRetrait(formData, token);
            } else {
                setMessage("Erreur : Type de transaction non supporté.");
                return;
            }

            if (response.ok) {
                setMessage(`${actionText} réussi !`);
                // Réinitialise le montant, mais conserve l'ID par défaut
                setFormData({ account_id: defaultAccountId || "", amount: "" });
            } else {
                // Utilise la propriété 'detail' pour plus de précision si disponible
                const errorDetail = response.detail || response.error || "Veuillez vérifier les informations.";
                setMessage("Erreur : " + errorDetail);
            }

        } catch (error) {
            setMessage("Échec de l'opération. Réessayez.");
        }
    };

    
    return ( 
        <div className="flex justify-center items-center p-6 bg-gray-900">
            
            <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-2xl text-white">
                
                
                {message && (
                    <div 
                        className={`p-3 mb-4 rounded font-medium ${getMessageClass(message)}`}
                    >
                        {message}
                    </div>
                )}
                
                
                <h2 className="text-2xl font-bold mb-6 text-center text-green-400">
                    {formTitle}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6"> 
                    
                    
                    <div className="p-3 bg-gray-700 border border-green-500 rounded-lg text-sm font-medium text-white">
                        Compte source utilisé : {formData.account_id}
                    </div>
                    
                    <input 
                        type="hidden" 
                        id="account_id"
                        name="account_id"
                        value={formData.account_id} 
                        onChange={handleChange} 
                    />
                    
                    {/* Champ pour le montant */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Montant de l'opération (€)</label>
                        <input 
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            placeholder="Montant de l'opération"
                            
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-green-500 focus:border-green-500 transition duration-150"
                            step="0.01"
                        />
                    </div>
                    
                    
                    <button 
                        type="submit"
                        className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md font-semibold transition duration-200 shadow-md text-white"
                    >
                        {formTitle}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SimpleTransactionForm;