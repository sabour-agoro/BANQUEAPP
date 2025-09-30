import { useState, useEffect } from "react";
import { getAllTransactions } from "../Api";

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem("token");
            if (!token) { 
                setMessage("Erreur : token manquant.")
                setIsLoading(false);
                return; 
            }
            try {
                const transactionsResponse = await getAllTransactions(null, token);
                setTransactions(transactionsResponse.result || []);
                setMessage("Transactions chargées avec succès.");   

            } catch (error) {
                setMessage("Erreur de récupération : " + error.error || error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, []);
    

const getMessageClass = (msg) => {
    if (msg && msg.includes("Erreur")) {
        return "bg-red-800 text-white";
    }
    return "bg-green-800 text-white";
};

return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-400">
            Journal de Toutes les Transactions (Admin)
        </h1>
        
        {message && (
            <div className={`p-3 mb-4 rounded font-medium ${getMessageClass(message)}`}>
                {message}
            </div>
        )}

        
        {isLoading && (
            <p className="text-center text-gray-400">Chargement des transactions...</p>
        )}

        {!isLoading && transactions.length === 0 && message && !message.includes("Erreur") && (
            <p className="text-center p-4 bg-gray-800 rounded">Aucune transaction trouvée.</p>
        )}

        {/*données*/}
        {!isLoading && transactions.length > 0 && (
                <div className="overflow-x-auto mt-6 border border-gray-700 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID Transac</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Montant</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Compte Source</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Compte Dest.</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {transactions.map((t) => (
                                <tr key={t.id_transaction} className="hover:bg-gray-700 transition duration-150">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{t.id_transaction.substring(0, 8)}...</td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${t.type_transaction === 'DEPOT' ? 'text-green-500' : t.type_transaction === 'RETRAIT' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {t.type_transaction}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap font-bold text-lg text-green-400">
                                        {t.montant.toFixed(2)} €
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{t.account_id_source}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{t.account_id_destination || 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                                        {new Date(t.date_transaction).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminTransactions;