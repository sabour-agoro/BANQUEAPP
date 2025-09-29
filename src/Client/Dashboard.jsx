import { useState } from "react";
import { useEffect } from "react";
import Comptes from "../Admin/Comptes";
import { getUserComptes } from "../Api";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [comptes, setComptes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                setMessage("Erreur : Vous devez être connecté.");
            }
            try {
                const comptesResponse = await getUserComptes(null, token);
                if (comptesResponse.ok && comptesResponse.result) {
                    setComptes(comptesResponse.result);
                    setMessage("Comptes chargés avec succès.");
                }
                else {
                setMessage("Erreur de transfert : " + response.detail );
                }
            } catch (error) {
                setMessage("Erreur de connexion : " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

    }, []);

    const getMessageClass = (msg) => {
        if (msg && (msg.includes("Erreur") || msg.includes("connecté"))) {
            return "bg-red-200 text-red-800";
        }
        return "bg-green-200 text-green-800";
    };

    const defaultAccountId = comptes.length > 0 ? comptes[0].id_compte : null;
    
    
    return ( 
        // 1. Container sombre
        <div className="p-8 max-w-4xl mx-auto bg-gray-900 shadow-lg rounded-lg text-white"> 
            
            {/* 1. Affichage de l'état de Chargement */}
            {isLoading && (
                <div className="text-center text-xl font-semibold p-10">
                    Chargement des données du tableau de bord...
                </div>
            )}
            
            {/* Affichage du Message/Erreur (Utilisation de getMessageClass inchangée) */}
            {message && (
                <div className={`p-4 mb-6 rounded font-medium ${getMessageClass(message)}`}>
                    {message}
                </div>
            )}
            
            {/* Affichage du Contenu Principal */}
            {!isLoading && comptes.length > 0 && (
                <div>
                    <h1 className="text-3xl font-bold mb-6 border-b pb-2">
                        Vos Comptes Bancaires
                    </h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            {/* 3. Header sombre */}
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"> 
                                        Type de Compte
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        ID du Compte
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Solde
                                    </th>
                                </tr>
                            </thead>
                            {/* Corps du tableau sombre */}
                            <tbody className="bg-gray-800 divide-y divide-gray-700"> 
                                {comptes.map((compte) => (
                                    <tr key={compte.id_compte} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">{compte.type_compte || 'Courant'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{compte.id_compte}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                            {compte.solde.toFixed(2)} €
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/*Affichage s'il n'y a aucun compte (on garde le jaune pour l'alerte) */}
            {!isLoading && comptes.length === 0 && !message && (
                 <div className="text-center p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    Bienvenue ! Vous n'avez pas encore de compte enregistré.
                </div>
            )}

        </div>
    );
}

export default Dashboard;