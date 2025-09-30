import { useState, useEffect } from "react";
import { getUserComptes } from "../Api"; 
import TransferForm from "./TransferForm";
import SimpleTransactionForm from "./SimpleTransactionForm"; 

// Fonction utilitaire pour le CSS 
const getMessageClass = (msg) => {
    if (msg && (msg.includes("Erreur") || msg.includes("connecté"))) {
        return "bg-red-200 text-red-800";
    }
    return "bg-green-200 text-green-800";
};


function TransactionPage() {
   
    const [comptes, setComptes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);

    
    const [viewMode, setViewMode] = useState('accounts'); 

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                setMessage("Erreur : Vous devez être connecté.");
                return; 
            }
            try {
                const comptesResponse = await getUserComptes(null, token);
                
                if (comptesResponse.ok && Array.isArray(comptesResponse.result)) {
                    setComptes(comptesResponse.result);
                    setMessage("Comptes chargés avec succès.");
                } else {
                    setMessage("Erreur de l'API : " + (comptesResponse.detail || "Problème de format de données."));
                }
            } catch (error) {
                setMessage("Erreur de connexion : " + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    
    const defaultAccountId = comptes.length > 0 ? comptes[0].id_compte : null;

    

    return ( 
        
        <div className="p-8 max-w-4xl mx-auto bg-gray-900 shadow-lg rounded-lg text-white">
            
            {/* 1. Affichage du Message/Erreur */}
            {message && (
                <div className={`p-4 mb-6 rounded font-medium ${getMessageClass(message)}`}>
                    {message}
                </div>
            )}
            
            {!isLoading && comptes.length > 0 && (
                <div>
                    {/* boutons de navigation pour viewMode */}
                    <div className="flex justify-start space-x-4 mb-6 border-b border-gray-700 pb-2">
                        <button
                            onClick={() => setViewMode('accounts')}
                            className={`px-4 py-2 font-semibold transition duration-150 ${viewMode === 'accounts' ? 'bg-green-600 text-white rounded-t-lg' : 'text-gray-400 hover:text-green-400'}`}
                        >
                            Vue d'ensemble
                        </button>
                        <button
                            onClick={() => setViewMode('transfert')}
                            className={`px-4 py-2 font-semibold transition duration-150 ${viewMode === 'transfert' ? 'bg-green-600 text-white rounded-t-lg' : 'text-gray-400 hover:text-green-400'}`}
                        >
                            Transfert
                        </button>
                        <button
                            onClick={() => setViewMode('transactions')}
                            className={`px-4 py-2 font-semibold transition duration-150 ${viewMode === 'transactions' ? 'bg-green-600 text-white rounded-t-lg' : 'text-gray-400 hover:text-green-400'}`}
                        >
                            Dépôt / Retrait
                        </button>
                    </div>

                    
                    {viewMode === 'accounts' && (
                        <>
                            <h1 className="text-3xl font-bold mb-6 border-b pb-2">
                                Vos Comptes Bancaires
                            </h1>
                            {/* TABLEAU DES COMPTES (Thème sombre) */}
                            <div className="overflow-x-auto mb-10">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type de Compte</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID du Compte</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Solde</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {comptes.map((compte) => (
                                            <tr key={compte.id_compte} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">{compte.type_compte || 'Courant'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{compte.id_compte}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                                                    {compte.solde.toFixed(2)} €
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {viewMode === 'transfert' && (
                        // TransferForm est affiché et reçoit l'ID !
                        <TransferForm defaultAccountId={defaultAccountId} /> 
                    )}
                    
                    {viewMode === 'transactions' && (
                        // Les deux SimpleTransactionForm sont affichés et reçoivent l'ID !
                        <div className="flex flex-col md:flex-row gap-8 w-full">
                            <SimpleTransactionForm transactionType="depot" defaultAccountId={defaultAccountId} />
                            <SimpleTransactionForm transactionType="retrait" defaultAccountId={defaultAccountId} />
                        </div>
                    )}
                </div>
            )}
            
            {/* 4. Affichage s'il n'y a aucun compte (inchangé) */}
            {!isLoading && comptes.length === 0 && !message && (
                 <div className="text-center p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    Bienvenue ! Vous n'avez pas encore de compte enregistré.
                </div>
            )}

        </div>
    );
}

export default TransactionPage;