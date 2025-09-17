"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Demande {
  id: string;
  proprio_id: string;
  pro_id: string;
  equide_id: string;
  type: string;
  statut: string;
  date: string;
  adresse: string;
  telephone?: string;
  description: string;
  creneaux_alternatifs: any[];
  created_at: string;
  proprio?: {
    nom: string;
    prenom: string;
    telephone: string;
  };
  equide?: {
    nom: string;
    race: string;
    age: number;
  };
}

export default function ProDemandes() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pro/demandes');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des demandes');
      }

      setDemandes(data.demandes || []);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleStatutChange = async (demandeId: string, nouveauStatut: string) => {
    try {
      // Pour l'instant, juste mettre à jour l'état local
      setDemandes(prev => 
        prev.map(demande => 
          demande.id === demandeId 
            ? { ...demande, statut: nouveauStatut }
            : demande
        )
      );
      
      console.log(`Demande ${demandeId} mise à jour: ${nouveauStatut}`);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTEE':
        return 'bg-green-100 text-green-800';
      case 'REFUSEE':
        return 'bg-red-100 text-red-800';
      case 'ANNULEE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'ACCEPTEE':
        return 'Acceptée';
      case 'REFUSEE':
        return 'Refusée';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return statut;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F86F4D]"></div>
        <span className="ml-3 text-[#1B263B]/60">Chargement des demandes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Erreur: {error}</p>
        <button 
          onClick={fetchDemandes}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1B263B]">
          Demandes de rendez-vous
        </h2>
        <button
          onClick={fetchDemandes}
          className="text-sm text-[#F86F4D] hover:text-[#F86F4D]/80 font-medium"
        >
          Actualiser
        </button>
      </div>

      {demandes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#1B263B] mb-2">Aucune demande</h3>
          <p className="text-[#1B263B]/60">
            Vous n'avez pas encore de demandes de rendez-vous.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((demande, index) => (
            <motion.div
              key={demande.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white border border-[#1B263B]/10 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1B263B]">
                    {demande.proprio?.prenom} {demande.proprio?.nom}
                  </h3>
                  <p className="text-sm text-[#1B263B]/60">
                    {demande.equide?.nom} • {demande.equide?.race} • {demande.equide?.age} ans
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(demande.statut)}`}>
                  {getStatutLabel(demande.statut)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm font-medium text-[#1B263B]">Date souhaitée:</span>
                  <p className="text-sm text-[#1B263B]/70">
                    {new Date(demande.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-[#1B263B]">Adresse:</span>
                  <p className="text-sm text-[#1B263B]/70">{demande.adresse}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-[#1B263B]">Description:</span>
                  <p className="text-sm text-[#1B263B]/70">{demande.description}</p>
                </div>

                {demande.creneaux_alternatifs && demande.creneaux_alternatifs.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-[#1B263B]">Créneaux alternatifs:</span>
                    <div className="mt-1 space-y-1">
                      {demande.creneaux_alternatifs.map((creneau, idx) => (
                        <p key={idx} className="text-sm text-[#1B263B]/70">
                          {new Date(creneau.date).toLocaleDateString('fr-FR')} à {creneau.heure}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {demande.statut === 'EN_ATTENTE' && (
                <div className="flex gap-3 pt-4 border-t border-[#1B263B]/10">
                  <button
                    onClick={() => handleStatutChange(demande.id, 'ACCEPTEE')}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => handleStatutChange(demande.id, 'REFUSEE')}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Refuser
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

