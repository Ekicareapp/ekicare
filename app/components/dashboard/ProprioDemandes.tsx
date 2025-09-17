"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, EyeIcon, HeartIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useDemandes, useRendezVous } from "@/hooks/useApiData";
import { useSession } from "next-auth/react";

interface RendezVous {
  id: string;
  pro: {
    id?: string;
    nom: string;
    metier: string;
    ville: string;
  };
  equide: {
    id?: string;
    nom: string;
    race?: string;
    age?: string;
  };
  client?: {
    nom: string;
    prenom?: string;
  };
  date: string;
  heure: string;
  type: string;
  motif: string;
  statut: "pending" | "accepted" | "rejected" | "completed" | "replanifie";
  description: string;
  adresse: string;
  compteRendu?: {
    etatGeneral: string;
    observations: string;
    procedures: string;
    medicaments: string;
    recommandations: string;
    suivi: string;
  };
  compteRenduDate?: string;
  creneauxAlternatifs?: { date: string; heure: string }[];
}

// Les données sont maintenant récupérées depuis l'API via les hooks useDemandes et useRendezVous
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getStatutColor = (statut: string) => {
  switch (statut) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "replanifie":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-gray-100 text-gray-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case "pending":
      return "En attente";
    case "accepted":
      return "À venir";
    case "replanifie":
      return "En attente";
    case "rejected":
      return "Refusé";
    case "completed":
      return "Terminé";
    default:
      return "Inconnu";
  }
};

export default function ProprioDemandes() {
  const { data: session } = useSession();
  const { demandes, loading: demandesLoading, updateDemande } = useDemandes();
  const { rendezVous, loading: rendezVousLoading } = useRendezVous();
  
  const [activeTab, setActiveTab] = useState('en-attente');
  const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompteRenduModalOpen, setIsCompteRenduModalOpen] = useState(false);
  const [localDemandes, setLocalDemandes] = useState<any[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [demandeToCancel, setDemandeToCancel] = useState<any>(null);
  
  // États pour la popup de créneau alternatif
  const [showCreneauAlternatifModal, setShowCreneauAlternatifModal] = useState(false);
  const [selectedRdvForCreneau, setSelectedRdvForCreneau] = useState<RendezVous | null>(null);
  const [creneauForm, setCreneauForm] = useState({
    date: '',
    heure: '',
    description: ''
  });
  
  // États pour les notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({ type: 'info', message: '', show: false });

  // Fonction pour afficher une notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Charger les demandes depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ekicare_demandes');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocalDemandes(parsed);
        } catch (error) {
          console.error('Erreur parsing localStorage:', error);
        }
      }
    }
  }, []);

  // Écouter les nouvelles demandes depuis le localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('ekicare_demandes');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setLocalDemandes(parsed);
          } catch (error) {
            console.error('Erreur parsing localStorage:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  // Transformer les données de l'API en format compatible avec le design
  const transformDataToRendezVous = (): RendezVous[] => {
    const transformedData: RendezVous[] = [];

    // Combiner les demandes de l'API et du localStorage en évitant les doublons
    const allDemandes = [...demandes];
    
    // Ajouter les demandes du localStorage seulement si elles ne sont pas déjà dans l'API
    localDemandes.forEach(localDemande => {
      const existsInApi = demandes.some(apiDemande => apiDemande.id === localDemande.id);
      if (!existsInApi) {
        allDemandes.push(localDemande);
      }
    });

    // Transformer les demandes en rendez-vous
    allDemandes.forEach(demande => {
      
      // Adapter selon la structure des données reçues
      const rdv: RendezVous = {
        id: demande.id,
        pro: {
          nom: demande.pro?.nom || demande.pro?.prenom || 'Professionnel inconnu',
          metier: demande.pro?.metier || demande.pro?.profession || 'Métier inconnu',
          ville: demande.pro?.ville || 'Ville inconnue'
        },
        equide: {
          id: demande.equide?.id,
          nom: demande.equide?.nom || 'Équidé inconnu',
          race: demande.equide?.race || 'Race inconnue',
          age: demande.equide?.age?.toString() || 'Âge inconnu'
        },
        date: demande.start_at ? new Date(demande.start_at).toISOString().split('T')[0] : 
              demande.date ? new Date(demande.date).toISOString().split('T')[0] : 
              new Date().toISOString().split('T')[0],
        heure: demande.start_at ? new Date(demande.start_at).toISOString().split('T')[1].substring(0, 5) :
               demande.date ? new Date(demande.date).toISOString().split('T')[1].substring(0, 5) :
               '00:00',
        type: demande.type || 'Consultation',
        motif: demande.description || 'Demande de soin',
        statut: demande.statut === 'pending' ? 'pending' : 
                demande.statut === 'accepted' ? 'accepted' : 
                demande.statut === 'rejected' ? 'rejected' : 
                demande.statut === 'EN_ATTENTE' ? 'pending' :
                demande.statut === 'ACCEPTEE' ? 'accepted' :
                demande.statut === 'REFUSEE' ? 'rejected' :
                demande.statut === 'REPLANIFIEE' ? 'replanifie' :
                demande.statut === 'ANNULEE' ? 'completed' : 'pending',
        description: demande.description || 'Demande de rendez-vous',
        adresse: demande.adresse || demande.pro?.ville || 'Adresse non spécifiée',
        creneauxAlternatifs: demande.creneaux_alternatifs || []
      };
      transformedData.push(rdv);
    });

    // Transformer les rendez-vous confirmés
    rendezVous.forEach(rdv => {
      const transformedRdv: RendezVous = {
        id: rdv.id,
        pro: {
          nom: rdv.client?.nom || 'Client inconnu',
          metier: 'Client',
          ville: rdv.client?.ville || 'Ville inconnue'
        },
        equide: {
          id: rdv.equide?.id,
          nom: rdv.equide?.nom || 'Équidé inconnu',
          race: rdv.equide?.race || 'Race inconnue',
          age: rdv.equide?.age?.toString() || 'Âge inconnu'
        },
        date: rdv.date,
        heure: rdv.heure,
        type: 'Consultation',
        motif: rdv.notes || 'Rendez-vous confirmé',
        statut: rdv.statut === 'confirmé' ? 'accepted' : 
                rdv.statut === 'terminé' ? 'completed' : 
                rdv.statut === 'annulé' ? 'rejected' : 'pending',
        description: rdv.notes || 'Rendez-vous confirmé',
        adresse: rdv.client?.adresse || 'Adresse non spécifiée',
        creneauxAlternatifs: rdv.creneaux_alternatifs || []
      };
      transformedData.push(transformedRdv);
    });

    return transformedData;
  };

  const rendezVousData = transformDataToRendezVous();

  const handleCancelDemande = (demande: any) => {
    setDemandeToCancel(demande);
    setShowCancelConfirm(true);
  };

  // Fonction pour accepter une replanification
  const handleAccepterReplanification = async (rdv: RendezVous) => {
    try {
      const response = await fetch('/api/demandes/accept-replanification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          demandeId: rdv.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'acceptation');
      }

      const result = await response.json();
      console.log('✅ Replanification acceptée:', result.message);
      showNotification('success', 'Replanification acceptée avec succès');
      
      // Mise à jour optimiste : recharger les données
      await fetchDemandes();
      await fetchRendezVous();
    } catch (error) {
      console.error('❌ Erreur lors de l\'acceptation:', error);
      showNotification('error', 'Erreur lors de l\'acceptation de la replanification');
    }
  };

  // Fonction pour refuser une replanification
  const handleRefuserReplanification = async (rdv: RendezVous) => {
    try {
      const response = await fetch('/api/demandes/refuse-replanification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          demandeId: rdv.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du refus');
      }

      const result = await response.json();
      console.log('✅ Replanification refusée:', result.message);
      showNotification('success', 'Replanification refusée avec succès');
      
      // Mise à jour optimiste : recharger les données
      await fetchDemandes();
      await fetchRendezVous();
    } catch (error) {
      console.error('❌ Erreur lors du refus:', error);
      showNotification('error', 'Erreur lors du refus de la replanification');
    }
  };

  // Fonction pour proposer un créneau alternatif
  const handleCreneauAlternatif = (rdv: RendezVous) => {
    setSelectedRdvForCreneau(rdv);
    setCreneauForm({
      date: '',
      heure: '',
      description: `Nouvelle proposition de créneau pour ${rdv.equide?.nom || 'votre équidé'}`
    });
    setShowCreneauAlternatifModal(true);
  };

  // Fonction pour fermer la popup de créneau alternatif
  const closeCreneauAlternatifModal = () => {
    setShowCreneauAlternatifModal(false);
    setSelectedRdvForCreneau(null);
    setCreneauForm({ date: '', heure: '', description: '' });
  };

  // Fonction pour soumettre le créneau alternatif
  const handleSubmitCreneauAlternatif = async () => {
    if (!selectedRdvForCreneau || !creneauForm.date || !creneauForm.heure) {
      showNotification('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Créer une nouvelle demande avec le créneau alternatif
      const response = await fetch('/api/demandes/rdv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proId: selectedRdvForCreneau.pro?.id,
          date: creneauForm.date,
          heure: creneauForm.heure,
          description: creneauForm.description,
          adresse: selectedRdvForCreneau.adresse,
          equides: [selectedRdvForCreneau.equide?.id].filter(Boolean),
          creneauxAlternatifs: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la demande');
      }

      const result = await response.json();
      console.log('✅ Nouvelle demande créée:', result.message);
      showNotification('success', 'Nouvelle demande créée avec succès');
      
      // Fermer la popup et recharger les données
      closeCreneauAlternatifModal();
      await fetchDemandes();
      await fetchRendezVous();
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      showNotification('error', 'Erreur lors de la création de la nouvelle demande');
    }
  };

  const confirmCancel = async () => {
    if (!demandeToCancel) return;
    
    try {
      console.log('Annulation de la demande:', demandeToCancel.id);
      
      // Mettre à jour le localStorage d'abord
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('ekicare_demandes');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const updated = parsed.map((d: any) => 
              d.id === demandeToCancel.id ? { ...d, statut: 'ANNULEE' } : d
            );
            localStorage.setItem('ekicare_demandes', JSON.stringify(updated));
            setLocalDemandes(updated);
          } catch (error) {
            console.error('Erreur mise à jour localStorage:', error);
          }
        }
      }
      
      // Ensuite appeler l'API
      const result = await updateDemande(demandeToCancel.id, 'rejected');
      console.log('Résultat de l\'annulation:', result);
      
      setShowCancelConfirm(false);
      setDemandeToCancel(null);
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la demande:', error);
    }
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
    setDemandeToCancel(null);
  };

  const handleVoirDetails = (rdv: RendezVous) => {
    setSelectedRdv(rdv);
    setIsModalOpen(true);
  };

  const handleVoirCompteRendu = (rdv: RendezVous) => {
    setSelectedRdv(rdv);
    setIsCompteRenduModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRdv(null);
  };

  const closeCompteRenduModal = () => {
    setIsCompteRenduModalOpen(false);
    setSelectedRdv(null);
  };

  const rendezVousEnAttente = rendezVousData.filter(d => d.statut === "pending");
  const rendezVousAvenir = rendezVousData.filter(d => d.statut === "accepted");
  const rendezVousReplanifies = rendezVousData.filter(d => d.statut === "replanifie");
  const rendezVousTermines = rendezVousData.filter(d => d.statut === "completed");

  const getFilteredRendezVous = () => {
    switch (activeTab) {
      case 'en-attente':
        return rendezVousEnAttente;
      case 'a-venir':
        return rendezVousAvenir;
      case 'replanifies':
        return rendezVousReplanifies;
      case 'termines':
        return rendezVousTermines;
      default:
        return rendezVousEnAttente;
    }
  };

  const tabs = [
    { id: 'en-attente', label: 'Demandes', count: rendezVousEnAttente.length },
    { id: 'a-venir', label: 'À venir', count: rendezVousAvenir.length },
    { id: 'replanifies', label: 'Replanifiés', count: rendezVousReplanifies.length },
    { id: 'termines', label: 'Terminés', count: rendezVousTermines.length },
  ];

  // État de chargement
  if (demandesLoading || rendezVousLoading) {
    return (
      <div className="space-y-6 overflow-x-hidden w-full max-w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden w-full max-w-full">
      {/* En-tête */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B] mb-2">
              Mes rendez-vous
            </h1>
            <p className="text-[#1B263B]/70">
              Gérez tous vos rendez-vous avec les professionnels.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 text-sm font-medium text-[#1B263B] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            title="Actualiser les données"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {tabs.map((tab) => (
          <div key={tab.id} className="bg-white rounded-lg border border-[#1B263B]/10 p-3 w-full">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">{tab.label}</p>
                  <p className="text-lg sm:text-xl font-bold text-[#1B263B]">{tab.count}</p>
                </div>
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  tab.id === 'en-attente' ? 'bg-yellow-100' :
                  tab.id === 'a-venir' ? 'bg-green-100' :
                  tab.id === 'refuses' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {tab.id === 'en-attente' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  )}
                  {tab.id === 'a-venir' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                  )}
                  {tab.id === 'replanifies' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                  )}
                  {tab.id === 'termines' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  )}
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row w-full gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium transition-colors w-full sm:w-auto text-left sm:text-center ${
                activeTab === tab.id
                  ? 'text-[#F86F4D] border-b-2 border-[#F86F4D]'
                  : 'text-[#1B263B]/60 hover:text-[#1B263B]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 w-full">
        {getFilteredRendezVous().length === 0 ? (
          <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-[#F86F4D]/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#F86F4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1B263B] mb-2">
              Aucun rendez-vous
          </h3>
            <p className="text-[#1B263B]/70">
              Vous n'avez pas de rendez-vous dans cette catégorie.
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {getFilteredRendezVous().map((rdv, index) => (
              <div
                key={rdv.id}
                className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 hover:shadow-md transition-shadow w-full relative"
              >
                {/* Boutons d'action en haut à gauche (desktop seulement) */}
                <div className="hidden sm:flex absolute top-3 right-3 gap-2">
                  <button
                    onClick={() => handleVoirDetails(rdv)}
                    className="px-3 py-2 text-sm font-medium text-[#F86F4D] hover:bg-[#F86F4D]/10 rounded-md transition-colors flex items-center justify-center gap-1"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Détails
                  </button>
                  
                  {rdv.statut === "pending" && (
                    <button
                      onClick={() => handleCancelDemande(rdv)}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                  
                  {rdv.statut === "replanifie" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleAccepterReplanification(rdv)}
                        className="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleRefuserReplanification(rdv)}
                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        Refuser
                      </button>
                      <button
                        onClick={() => handleCreneauAlternatif(rdv)}
                        className="px-3 py-2 text-sm font-medium text-[#1B263B] bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
                      >
                        Créneau alternatif
                      </button>
                    </div>
                  )}
                  
                  {rdv.statut === "completed" && rdv.compteRendu && (
                    <button
                      onClick={() => handleVoirCompteRendu(rdv)}
                      className="px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center justify-center gap-1"
                    >
                      <HeartIcon className="w-4 h-4" />
                      Compte-rendu
                    </button>
                  )}
                </div>

                {/* En-tête avec nom et statut */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 pr-32 sm:pr-32">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B263B]">
                      {rdv.pro.nom}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full self-start ${getStatutColor(rdv.statut)}`}>
                      {getStatutLabel(rdv.statut)}
                    </span>
                  </div>
                </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-4 min-w-0">
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Professionnel:</span> {rdv.pro.metier}
                  </div>
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Ville:</span> {rdv.pro.ville}
                  </div>
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Équidé:</span> {rdv.equide.nom} ({rdv.equide.race}, {rdv.equide.age})
                  </div>
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Date:</span> {formatDate(rdv.date)} à {rdv.heure}
                  </div>
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Motif:</span> {rdv.motif}
                  </div>
                  <div className="text-sm text-[#1B263B]/60 break-words">
                    {rdv.adresse}
                  </div>
                </div>

                {/* Boutons d'action en bas (mobile seulement) */}
                <div className="flex sm:hidden flex-col gap-2">
                  <button
                    onClick={() => handleVoirDetails(rdv)}
                    className="px-3 py-2 text-sm font-medium text-[#F86F4D] hover:bg-[#F86F4D]/10 rounded-md transition-colors flex items-center justify-center gap-1"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Détails
                  </button>
                  
                  {rdv.statut === "pending" && (
                    <button
                      onClick={() => handleCancelDemande(rdv)}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                  
                  {rdv.statut === "replanifie" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleAccepterReplanification(rdv)}
                        className="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleRefuserReplanification(rdv)}
                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        Refuser
                      </button>
                      <button
                        onClick={() => handleCreneauAlternatif(rdv)}
                        className="px-3 py-2 text-sm font-medium text-[#1B263B] bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
                      >
                        Créneau alternatif
                      </button>
                    </div>
                  )}
                  
                  {rdv.statut === "completed" && rdv.compteRendu && (
                    <button
                      onClick={() => handleVoirCompteRendu(rdv)}
                      className="px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center justify-center gap-1"
                    >
                      <HeartIcon className="w-4 h-4" />
                      Compte-rendu
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <AnimatePresence>
        {isModalOpen && selectedRdv && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl max-w-full sm:max-w-2xl w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-900">
                      Détails du rendez-vous
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedRdv.pro.nom} - {selectedRdv.equide.nom}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-3 sm:p-6 overflow-y-auto flex-1">
                <div className="space-y-3 sm:space-y-6">
                  {/* Informations principales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Date</p>
                        <p className="text-sm text-[#1B263B]">
                          {formatDate(selectedRdv.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Heure</p>
                        <p className="text-sm text-[#1B263B]">{selectedRdv.heure}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Professionnel</p>
                        <p className="text-sm text-[#1B263B]">{selectedRdv.pro.nom}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Spécialité</p>
                        <p className="text-sm text-[#1B263B]">{selectedRdv.pro.metier}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Ville</p>
                        <p className="text-sm text-[#1B263B]">{selectedRdv.pro.ville}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Statut</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(selectedRdv.statut)}`}>
                          {getStatutLabel(selectedRdv.statut)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Adresse</p>
                    <p className="text-sm text-[#1B263B] break-words">
                      {selectedRdv.adresse}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Équidé</p>
                    <p className="text-sm text-[#1B263B]">
                      {selectedRdv.equide.nom} - {selectedRdv.equide.race} ({selectedRdv.equide.age})
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Motif</p>
                    <p className="text-sm text-[#1B263B]/70 bg-gray-50 rounded-lg p-2 sm:p-3">
                      {selectedRdv.motif}
                    </p>
                  </div>
                  
                  {/* Créneaux alternatifs */}
                  {selectedRdv.creneauxAlternatifs && selectedRdv.creneauxAlternatifs.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[#1B263B]/70 mb-2">Créneaux alternatifs proposés</p>
                      <div className="space-y-2">
                        {selectedRdv.creneauxAlternatifs.map((creneau, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-3">
                            <p className="text-sm text-[#1B263B]">
                              {formatDate(creneau.date)} à {creneau.heure}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pied */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-3 sm:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeModal}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-[#1B263B]/60 border border-[#1B263B]/20 rounded-lg hover:bg-[#1B263B]/5 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de compte-rendu */}
      <AnimatePresence>
        {isCompteRenduModalOpen && selectedRdv && selectedRdv.compteRendu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeCompteRenduModal}
            />
            
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl max-w-full sm:max-w-4xl w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-900">
                      Compte-rendu du rendez-vous
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedRdv.pro.nom} - {selectedRdv.equide.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(selectedRdv.date)} à {selectedRdv.heure}
                    </p>
                  </div>
                </div>
                    <button
                  onClick={closeCompteRenduModal}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-3 sm:p-6 overflow-y-auto flex-1">
                <div className="space-y-4 sm:space-y-6">
                  {/* Informations du rendez-vous */}
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                    <h3 className="text-xs sm:text-base font-medium text-[#1B263B] mb-2">Informations du rendez-vous</h3>
                    <div className="text-xs sm:text-sm">
                      <div>
                        <span className="font-medium text-[#1B263B]/70">Motif:</span>
                        <span className="ml-2 text-[#1B263B]">{selectedRdv.motif}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compte-rendu */}
                  <div className="space-y-3">
                    <h3 className="text-xs sm:text-base font-medium text-[#1B263B] mb-3">Compte-rendu du professionnel</h3>
                    
                    <div>
                      <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">État général de l'équidé</h4>
                      <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRdv.compteRendu.etatGeneral}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Observations cliniques</h4>
                      <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRdv.compteRendu.observations}</p>
                    </div>
                    
                    {selectedRdv.compteRendu.procedures && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Procédures effectuées</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRdv.compteRendu.procedures}</p>
                      </div>
                    )}
                    
                    {selectedRdv.compteRendu.medicaments && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Médicaments administrés</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRdv.compteRendu.medicaments}</p>
                      </div>
                    )}
                    
                    {selectedRdv.compteRendu.recommandations && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Recommandations</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRdv.compteRendu.recommandations}</p>
                      </div>
                    )}
                    
                    {selectedRdv.compteRendu.suivi && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Suivi recommandé</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRdv.compteRendu.suivi}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pied */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-3 sm:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeCompteRenduModal}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-[#1B263B]/60 border border-[#1B263B]/20 rounded-lg hover:bg-[#1B263B]/5 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Modal de confirmation d'annulation */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#1B263B]">
                  Annuler la demande
                </h3>
              </div>
              
              <p className="text-[#1B263B]/70 mb-6">
                Êtes-vous sûr de vouloir annuler cette demande de rendez-vous ? 
                Cette action est irréversible.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelCancel}
                  className="px-4 py-2 text-sm font-medium text-[#1B263B] bg-white border border-[#1B263B]/20 rounded-md hover:bg-[#1B263B]/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#F86F4D] rounded-md hover:bg-[#F86F4D]/90 transition-colors"
                >
                  Confirmer l'annulation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de créneau alternatif */}
      <AnimatePresence>
        {showCreneauAlternatifModal && selectedRdvForCreneau && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1B263B]">
                  Proposer un créneau alternatif
                </h3>
                <button
                  onClick={closeCreneauAlternatifModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={creneauForm.date}
                    onChange={(e) => setCreneauForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={creneauForm.heure}
                    onChange={(e) => setCreneauForm(prev => ({ ...prev, heure: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Description
                  </label>
                  <textarea
                    value={creneauForm.description}
                    onChange={(e) => setCreneauForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Décrivez votre nouvelle proposition..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeCreneauAlternatifModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-[#1B263B] border border-[#1B263B]/20 rounded-lg hover:bg-[#1B263B]/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitCreneauAlternatif}
                  disabled={!creneauForm.date || !creneauForm.heure}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#F86F4D] rounded-lg hover:bg-[#F86F4D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proposer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
              {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
              {notification.type === 'info' && <HeartIcon className="w-5 h-5" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
