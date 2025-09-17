"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarIcon, 
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  ArrowPathIcon,
  InboxIcon
} from "@heroicons/react/24/outline";
// import { useRendezVous } from "@/hooks/useRendezVous"; // Temporairement désactivé

// Types - Interface adaptée pour Supabase
interface RendezVous {
  id: string;
  demandeId?: string;
  proId?: string;
  clientId?: string;
  date: string;
  statut: "en_attente" | "confirmé" | "proposition_en_cours" | "annulé" | "terminé" | "demande" | "a_venir" | "replanifie" | "refuse" | "passe";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  age_equide?: number;
  race_equide?: string;
  date_proposition?: string;
  telephone?: string;
  creneaux_alternatifs?: string[];
  motif_replanification?: string;
  // Champs du compte-rendu (depuis la vue)
  compte_rendu_id?: string;
  etat_general?: string;
  observations?: string;
  procedures?: string;
  medicaments?: string;
  recommandations?: string;
  suivi?: string;
  compte_rendu_created_at?: string;
  compte_rendu_updated_at?: string;
  // Champs calculés pour l'affichage
  client?: string;
  equide?: string;
  adresse?: string;
  description?: string;
  // Propriétés mock data
  heure?: string;
  type?: string;
  motif?: string;
  compteRendu?: {
    diagnostic: string;
    traitement: string;
    recommandations: string;
    notes: string;
  };
  motifReplanification?: string;
  raceEquide?: string;
  ageEquide?: string;
  dateProposition?: string;
  creneauxAlternatifs?: Array<{
    date: string;
    heure: string;
  }>;
}

// Mock data - UNIQUEMENT pour l'onglet Mes rendez-vous du dashboard pro
const mockRendezVous: RendezVous[] = [
  // Demandes (en_attente)
  {
    id: "1",
    client: "Marie Dubois",
    equide: "Bella",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    heure: "14:00",
    type: "Consultation",
    statut: "en_attente",
    adresse: "123 Rue de la Paix, 69001 Lyon",
    telephone: "06 12 34 56 78",
    description: "Bella boite depuis 3 jours, besoin d'un examen approfondi de sa patte avant droite.",
    creneauxAlternatifs: ["2024-01-16 16:00", "2024-01-17 10:00"],
    ageEquide: 8,
    raceEquide: "Selle Français",
    dateProposition: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    client: "Jean Martin",
    equide: "Storm",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    heure: "10:30",
    type: "Vaccination",
    statut: "en_attente",
    adresse: "456 Avenue des Champs, 13001 Marseille",
    telephone: "06 23 45 67 89",
    description: "Vaccination annuelle de routine et contrôle de santé général.",
    creneauxAlternatifs: [],
    ageEquide: 12,
    raceEquide: "Pur-sang",
    dateProposition: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  // À venir (confirmé)
  {
    id: "3",
    client: "Sophie Leroy",
    equide: "Thunder",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    heure: "16:00",
    type: "Contrôle",
    statut: "confirmé",
    adresse: "789 Boulevard de la République, 06000 Nice",
    telephone: "06 34 56 78 90",
    description: "Contrôle de routine post-hiver et soins préventifs.",
    creneauxAlternatifs: [],
    ageEquide: 6,
    raceEquide: "Arabe",
    dateProposition: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    client: "Paul Bernard",
    equide: "Flash",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    heure: "09:00",
    type: "Soins dentaires",
    statut: "confirmé",
    adresse: "321 Rue de la Gare, 31000 Toulouse",
    telephone: "06 45 67 89 01",
    description: "Soins dentaires préventifs et détartrage complet.",
    creneauxAlternatifs: [],
    ageEquide: 10,
    raceEquide: "Friesian",
    dateProposition: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Replanifié (avec motifReplanification)
  {
    id: "5",
    client: "Thomas Petit",
    equide: "Luna",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    heure: "11:00",
    type: "Vaccination",
    statut: "proposition_en_cours",
    adresse: "987 Chemin des Écuries, 13008 Marseille",
    telephone: "06 67 89 01 23",
    description: "Vaccination de routine et bilan de santé.",
    creneauxAlternatifs: ["2024-01-20 10:00", "2024-01-21 14:00"],
    motifReplanification: "Conflit avec un autre rendez-vous urgent. Je propose ces créneaux alternatifs qui me conviennent mieux.",
    ageEquide: 5,
    raceEquide: "Paint Horse",
    dateProposition: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  // Refusé (annulé)
  {
    id: "6",
    client: "Pierre Lemoine",
    equide: "Pegasus",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    heure: "16:00",
    type: "Urgence",
    statut: "annulé",
    adresse: "741 Avenue du Parc, 06004 Nice",
    telephone: "06 01 23 45 67",
    description: "Urgence : colique suspectée - finalement résolue par le propriétaire.",
    creneauxAlternatifs: [],
    ageEquide: 8,
    raceEquide: "Frison",
    dateProposition: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Passés (terminé)
  {
    id: "7",
    client: "Marc Durand",
    equide: "Zeus",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    heure: "14:30",
    type: "Consultation",
    statut: "terminé",
    adresse: "258 Route des Écuries, 69003 Lyon",
    telephone: "06 89 01 23 45",
    description: "Consultation pour boiterie persistante - diagnostic de tendinite.",
    creneauxAlternatifs: [],
    ageEquide: 11,
    raceEquide: "Appaloosa",
    dateProposition: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    compteRendu: {
      etatGeneral: "L'équidé présente une boiterie modérée du membre antérieur gauche. Température normale, appétit conservé.",
      observations: "Examen clinique révèle une sensibilité à la palpation du tendon fléchisseur superficiel. Test de flexion positif.",
      procedures: "Échographie du tendon, application de bandage de contention, prescription de repos strict.",
      medicaments: "Phénylbutazone 2g/j pendant 5 jours, application locale de gel anti-inflammatoire 2x/jour",
      recommandations: "Repos strict pendant 4 semaines, sorties en main uniquement. Surveiller l'évolution de la boiterie.",
      suivi: "Contrôle dans 2 semaines pour évaluation de la cicatrisation. Échographie de contrôle prévue."
    }
  },
  {
    id: "8",
    client: "Nathalie Blanc",
    equide: "Athena",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    heure: "10:00",
    type: "Vaccination",
    statut: "terminé",
    adresse: "369 Allée des Chevaux, 13009 Marseille",
    telephone: "06 90 12 34 56",
    description: "Vaccination annuelle et premier bilan de santé complet.",
    creneauxAlternatifs: [],
    ageEquide: 4,
    raceEquide: "Mustang",
    dateProposition: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

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
    case "en_attente":
      return "bg-yellow-100 text-yellow-800";
    case "confirmé":
      return "bg-green-100 text-green-800";
    case "proposition_en_cours":
      return "bg-blue-100 text-blue-800";
    case "annulé":
      return "bg-red-100 text-red-800";
    case "terminé":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case "en_attente":
      return "En attente";
    case "confirmé":
      return "Confirmé";
    case "proposition_en_cours":
      return "Proposition en cours";
    case "annulé":
      return "Refusé";
    case "terminé":
      return "Terminé";
    default:
      return "Inconnu";
  }
};

export default function ProRendezVousProfessionnel() {
  const [activeTab, setActiveTab] = useState('demandes');
  
  // Temporairement avec des données mock pour éviter l'erreur
  const rendezVous = mockRendezVous;
  const loading = false;
  const error = null;
  
  const updateRendezVous = (id: string, updates: any) => {
    console.log('Mock updateRendezVous:', id, updates);
    // TODO: Implémenter avec l'API Prisma
  };
  
  const updateCompteRendu = (id: string, compteRendu: any) => {
    console.log('Mock updateCompteRendu:', id, compteRendu);
    // TODO: Implémenter avec l'API Prisma
  };
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplanifyModalOpen, setIsReplanifyModalOpen] = useState(false);
  const [isCompteRenduModalOpen, setIsCompteRenduModalOpen] = useState(false);
  const [isModifyingCompteRendu, setIsModifyingCompteRendu] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false);
  const [compteRenduForm, setCompteRenduForm] = useState({
    etatGeneral: '',
    observations: '',
    procedures: '',
    medicaments: '',
    recommandations: '',
    suivi: ''
  });
  const [replanifyForm, setReplanifyForm] = useState({
    nouvelleDate: '',
    nouvelleHeure: '',
    motif: ''
  });

  const handleVoirDetails = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setIsModalOpen(true);
  };

  const handleAccepter = (id: string) => {
    updateRendezVous(id.toString(), { statut: "confirmé" });
    console.log("Accepter rendez-vous:", id);
  };

  const handleRefuser = (id: string) => {
    updateRendezVous(id.toString(), { statut: "annulé" });
    console.log("Refuser rendez-vous:", id);
  };

  const handleReplanifier = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    // Réinitialiser le formulaire de replanification
    setReplanifyForm({
      nouvelleDate: '',
      nouvelleHeure: '',
      motif: ''
    });
    setIsReplanifyModalOpen(true);
  };

  const handleAjouterCompteRendu = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setIsModifyingCompteRendu(false);
    // Réinitialiser le formulaire si c'est un nouveau compte rendu
    if (!rdv.compteRendu) {
      setCompteRenduForm({
        etatGeneral: '',
        observations: '',
        procedures: '',
        medicaments: '',
        recommandations: '',
        suivi: ''
      });
    }
    setIsCompteRenduModalOpen(true);
  };

  const handleModifierCompteRendu = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setIsModifyingCompteRendu(true);
    // Pré-remplir le formulaire avec les données existantes
    if (rdv.compteRendu) {
      setCompteRenduForm({
        etatGeneral: rdv.compteRendu.etatGeneral,
        observations: rdv.compteRendu.observations,
        procedures: rdv.compteRendu.procedures || '',
        medicaments: rdv.compteRendu.medicaments || '',
        recommandations: rdv.compteRendu.recommandations || '',
        suivi: rdv.compteRendu.suivi || ''
      });
    }
    setIsCompteRenduModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRendezVous(null);
  };

  const closeReplanifyModal = () => {
    setIsReplanifyModalOpen(false);
    setSelectedRendezVous(null);
    setReplanifyForm({
      nouvelleDate: '',
      nouvelleHeure: '',
      motif: ''
    });
  };

  const closeCompteRenduModal = () => {
    setIsCompteRenduModalOpen(false);
    setIsModifyingCompteRendu(false);
    setIsFormModified(false);
    setSelectedRendezVous(null);
    setCompteRenduForm({
      etatGeneral: '',
      observations: '',
      procedures: '',
      medicaments: '',
      recommandations: '',
      suivi: ''
    });
  };

  // Validation des champs obligatoires et vérification des modifications
  const isCompteRenduValid = () => {
    const allFieldsFilled = compteRenduForm.etatGeneral.trim() !== '' && 
                           compteRenduForm.observations.trim() !== '' &&
                           compteRenduForm.procedures.trim() !== '' &&
                           compteRenduForm.medicaments.trim() !== '' &&
                           compteRenduForm.recommandations.trim() !== '' &&
                           compteRenduForm.suivi.trim() !== '';
    
    // En mode modification, vérifier aussi si des changements ont été apportés
    if (isModifyingCompteRendu && selectedRendezVous?.compteRendu) {
      const originalData = selectedRendezVous.compteRendu;
      const hasChanges = compteRenduForm.etatGeneral.trim() !== originalData.etatGeneral ||
                        compteRenduForm.observations.trim() !== originalData.observations ||
                        compteRenduForm.procedures.trim() !== (originalData.procedures || '') ||
                        compteRenduForm.medicaments.trim() !== (originalData.medicaments || '') ||
                        compteRenduForm.recommandations.trim() !== (originalData.recommandations || '') ||
                        compteRenduForm.suivi.trim() !== (originalData.suivi || '');
      
      return allFieldsFilled && hasChanges;
    }
    
    return allFieldsFilled;
  };

  const isReplanifyValid = () => {
    return replanifyForm.nouvelleDate !== '' && 
           replanifyForm.nouvelleHeure !== '' && 
           replanifyForm.motif.trim() !== '';
  };

  const handleCompteRenduSubmit = () => {
    if (!isCompteRenduValid() || !selectedRendezVous) return;
    
    // Créer ou modifier le compte rendu
    const compteRendu = {
      etatGeneral: compteRenduForm.etatGeneral.trim(),
      observations: compteRenduForm.observations.trim(),
      procedures: compteRenduForm.procedures.trim(),
      medicaments: compteRenduForm.medicaments.trim(),
      recommandations: compteRenduForm.recommandations.trim(),
      suivi: compteRenduForm.suivi.trim()
    };

    // Mettre à jour le rendez-vous via le hook
    updateCompteRendu(selectedRendezVous.id.toString(), compteRendu);

    // Synchroniser avec le store partagé (pour que le propriétaire puisse le voir)
    // En production, ceci sera un appel API vers Supabase
    console.log("🔄 Synchronisation du compte-rendu avec le propriétaire:", {
      rdvId: selectedRendezVous.id,
      client: selectedRendezVous.client,
      equide: selectedRendezVous.equide,
      compteRendu
    });

    closeCompteRenduModal();
    
    // Notification de succès
    alert(`✅ ${selectedRendezVous.compteRendu ? "Compte-rendu modifié" : "Compte-rendu créé"} avec succès !\n\nLe propriétaire (${selectedRendezVous.client}) pourra maintenant consulter ce compte-rendu dans son dashboard.`);
    
    console.log(selectedRendezVous.compteRendu ? "Compte rendu modifié:" : "Compte rendu créé:", compteRendu);
  };

  const handleReplanifySubmit = () => {
    if (!isReplanifyValid() || !selectedRendezVous) return;
    
    console.log("Replanification proposée:", {
      rdvId: selectedRendezVous.id,
      nouvelleDate: replanifyForm.nouvelleDate,
      nouvelleHeure: replanifyForm.nouvelleHeure,
      motif: replanifyForm.motif.trim()
    });
    
    closeReplanifyModal();
  };

  // Filtrage des rendez-vous
  const rendezVousDemandes = rendezVous.filter(d => d.statut === "en_attente");
  const rendezVousAvenir = rendezVous.filter(d => d.statut === "confirmé");
  const rendezVousReplanifies = rendezVous.filter(d => d.motifReplanification && d.motifReplanification.length > 0);
  const rendezVousRefuses = rendezVous.filter(d => d.statut === "annulé");
  const rendezVousTermines = rendezVous.filter(d => d.statut === "terminé");

  const getFilteredRendezVous = () => {
    switch (activeTab) {
      case 'demandes':
        return rendezVousDemandes;
      case 'avenir':
        return rendezVousAvenir;
      case 'replanifies':
        return rendezVousReplanifies;
      case 'refuses':
        return rendezVousRefuses;
      case 'termines':
        return rendezVousTermines;
      default:
        return rendezVousDemandes;
    }
  };

  const tabs = [
    { id: 'demandes', label: 'Demandes', count: rendezVousDemandes.length, icon: InboxIcon },
    { id: 'avenir', label: 'À venir', count: rendezVousAvenir.length, icon: CalendarIcon },
    { id: 'replanifies', label: 'Replanifiés', count: rendezVousReplanifies.length, icon: ArrowPathIcon },
    { id: 'refuses', label: 'Refusés', count: rendezVousRefuses.length, icon: XMarkIcon },
    { id: 'termines', label: 'Terminés', count: rendezVousTermines.length, icon: ClockIcon },
  ];

  return (
    <div className="space-y-6 overflow-x-hidden w-full max-w-full">
      {/* En-tête */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B] mb-2">
          Mes rendez-vous
        </h1>
        <p className="text-[#1B263B]/70">
          Gérez tous vos rendez-vous avec les propriétaires.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
        {tabs.map((tab) => (
          <div key={tab.id} className="bg-white rounded-lg border border-[#1B263B]/10 p-3 w-full">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">{tab.label}</p>
                  <p className="text-lg sm:text-xl font-bold text-[#1B263B]">{tab.count}</p>
            </div>
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  tab.id === 'demandes' ? 'bg-yellow-100' :
                  tab.id === 'avenir' ? 'bg-green-100' :
                  tab.id === 'replanifies' ? 'bg-purple-100' :
                  tab.id === 'refuses' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    tab.id === 'demandes' ? 'text-yellow-600' :
                    tab.id === 'avenir' ? 'text-green-600' :
                    tab.id === 'replanifies' ? 'text-purple-600' :
                    tab.id === 'refuses' ? 'text-red-600' :
                    'text-gray-600'
                  }`} />
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
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F86F4D] mx-auto mb-4"></div>
            <p className="text-[#1B263B]/70">Chargement des rendez-vous...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XMarkIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#1B263B] mb-2">
              Erreur de chargement
            </h3>
            <p className="text-[#1B263B]/70 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#F86F4D] text-white rounded-md hover:bg-[#F86F4D]/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : getFilteredRendezVous().length === 0 ? (
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
          <div className="space-y-3 w-full">
            {getFilteredRendezVous().map((rdv) => (
                <div 
                  key={rdv.id} 
                className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 hover:shadow-md transition-shadow w-full relative"
              >

                {/* En-tête avec nom */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B263B]">
                      {rdv.client}
                    </h3>
                  </div>
                    </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-2 min-w-0">
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Équidé:</span> {rdv.equide} ({rdv.raceEquide}, {rdv.ageEquide} ans)
                  </div>
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Date:</span> {formatDate(rdv.date)} à {rdv.heure}
                  </div>
                  <div className="text-sm text-[#1B263B]/60 break-words">
                    {rdv.adresse}
                  </div>
                  <div className="text-sm text-[#1B263B]/60 break-words">
                    {rdv.description}
                  </div>
                    </div>

                {/* Boutons d'action regroupés en bas à gauche */}
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 mt-4">
                      <button 
                        onClick={() => handleVoirDetails(rdv)}
                    className="p-1.5 text-[#1B263B]/70 hover:text-[#F86F4D] transition-colors"
                      >
                    <EyeIcon className="w-4 h-4" />
                      </button>
                      
                  {rdv.statut === "en_attente" && (
                    <>
                      <button
                        onClick={() => handleAccepter(rdv.id)}
                        className="w-full sm:w-auto px-3 py-1.5 text-sm font-medium text-white bg-[#F86F4D] hover:bg-[#F86F4D]/90 rounded-md transition-colors shadow-sm"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleRefuser(rdv.id)}
                        className="w-full sm:w-auto px-3 py-1.5 text-sm font-medium text-[#1B263B] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-300"
                      >
                        Refuser
                      </button>
                      <button
                        onClick={() => handleReplanifier(rdv)}
                        className="w-full sm:w-auto px-3 py-1.5 text-sm font-medium text-[#1B263B] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-300"
                      >
                        Replanifier
                      </button>
                    </>
                  )}
                  
                  {rdv.statut === "confirmé" && (
                    <button
                      onClick={() => handleReplanifier(rdv)}
                      className="w-full sm:w-auto px-3 py-1.5 text-sm font-medium text-[#1B263B] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-300"
                    >
                      Replanifier
                    </button>
                  )}
                  
                  {rdv.statut === "terminé" && (
                    <>
                      <button
                        onClick={() => handleAjouterCompteRendu(rdv)}
                        className="w-full sm:w-auto px-3 py-1.5 text-sm font-medium text-white bg-[#F86F4D] hover:bg-[#F86F4D]/90 rounded-md transition-colors shadow-sm"
                      >
                        {rdv.compteRendu ? "Voir compte-rendu" : "Créer compte-rendu"}
                      </button>
                      {rdv.compteRendu && (
                        <button
                          onClick={() => handleModifierCompteRendu(rdv)}
                          className="w-full sm:w-auto px-3 py-1.5 text-sm font-medium text-[#1B263B] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-300"
                        >
                          Modifier
                        </button>
                      )}
                    </>
                  )}
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>

      {/* Modal de détails */}
      <AnimatePresence>
        {isModalOpen && selectedRendezVous && (
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
                      {selectedRendezVous.client} - {selectedRendezVous.equide}
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
                  <div className="grid grid-rows-3 grid-cols-2 gap-3 sm:gap-6">
                    {/* Ligne 1 */}
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Date et heure</p>
                        <p className="text-sm text-[#1B263B]">
                          {formatDate(selectedRendezVous.date)} à {selectedRendezVous.heure}
                      </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Propriétaire</p>
                        <p className="text-sm text-[#1B263B]">{selectedRendezVous.client}</p>
                    </div>
                    
                    {/* Ligne 2 */}
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Équidé</p>
                        <p className="text-sm text-[#1B263B]">
                          {selectedRendezVous.equide} - {selectedRendezVous.raceEquide} ({selectedRendezVous.ageEquide} ans)
                      </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Téléphone</p>
                        <p className="text-sm text-[#1B263B]">{selectedRendezVous.telephone}</p>
                    </div>
                    
                    {/* Ligne 3 */}
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Proposition effectuée le</p>
                        <p className="text-sm text-[#1B263B]">{formatDate(selectedRendezVous.dateProposition)}</p>
                    </div>
                    <div>
                        {/* Cellule vide pour maintenir la structure de grille */}
                  </div>
                </div>

                <div>
                    <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Adresse</p>
                    <p className="text-sm text-[#1B263B] break-words">
                      {selectedRendezVous.adresse}
                  </p>
                </div>

                <div>
                    <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Motif</p>
                    <p className="text-sm text-[#1B263B]/70 bg-gray-50 rounded-lg p-2 sm:p-3">
                      {selectedRendezVous.description}
                  </p>
                </div>


                  {/* Créneaux alternatifs */}
                  {selectedRendezVous.creneauxAlternatifs && selectedRendezVous.creneauxAlternatifs.length > 0 && (
                <div>
                      <p className="text-xs font-medium text-[#1B263B]/70 mb-2">Créneaux alternatifs proposés</p>
                    <div className="space-y-2">
                        {selectedRendezVous.creneauxAlternatifs.map((creneau, index) => {
                          const [date, heure] = creneau.split(' ');
                          return (
                            <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-3">
                          <p className="text-sm text-[#1B263B]">
                                {formatDate(date)}
                          </p>
                        </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                  {/* Motif de replanification */}
                  {selectedRendezVous.motifReplanification && (
                    <div>
                      <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Motif de replanification</p>
                      <p className="text-sm text-[#1B263B]/70 bg-gray-50 rounded-lg p-2 sm:p-3">
                        {selectedRendezVous.motifReplanification}
                      </p>
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

      {/* Modal de replanification */}
      <AnimatePresence>
        {isReplanifyModalOpen && selectedRendezVous && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeReplanifyModal}
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
                    Replanifier le rendez-vous
                  </h2>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedRendezVous.client} - {selectedRendezVous.equide}
                  </p>
                </div>
              </div>
              <button
                  onClick={closeReplanifyModal}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

              {/* Contenu */}
              <div className="p-3 sm:p-6 overflow-y-auto flex-1">
              <div className="space-y-4 sm:space-y-6">
                  {/* Informations du rendez-vous actuel */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-base font-medium text-[#1B263B] mb-3">Rendez-vous actuel</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                        <p className="font-medium text-[#1B263B]/70">Date</p>
                        <p className="text-[#1B263B]">{formatDate(selectedRendezVous.date)}</p>
                </div>
                  <div>
                        <p className="font-medium text-[#1B263B]/70">Heure</p>
                        <p className="text-[#1B263B]">{selectedRendezVous.heure}</p>
                  </div>
                  <div>
                        <p className="font-medium text-[#1B263B]/70">Type</p>
                        <p className="text-[#1B263B]">{selectedRendezVous.type}</p>
                  </div>
                  <div>
                        <p className="font-medium text-[#1B263B]/70">Adresse</p>
                        <p className="text-[#1B263B]">{selectedRendezVous.adresse}</p>
                </div>
              </div>
            </div>

                  {/* Créneaux alternatifs proposés par le proprio */}
                  {selectedRendezVous.creneauxAlternatifs && selectedRendezVous.creneauxAlternatifs.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                      <h3 className="text-xs sm:text-base font-medium text-[#1B263B]/70 mb-3">
                        Créneaux alternatifs proposés par le propriétaire
                      </h3>
                    <div className="space-y-2">
                        {selectedRendezVous.creneauxAlternatifs.map((creneau, index) => {
                          const [date, heure] = creneau.split(' ');
                          return (
                            <div key={index} className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                          <p className="text-sm text-[#1B263B]">
                                {formatDate(date)}
                          </p>
                        </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Formulaire de replanification */}
                <div className="space-y-4">
                    <h3 className="text-xs sm:text-base font-medium text-[#1B263B] mb-3">Nouvelle proposition</h3>
                  
                    {/* Date */}
                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                        Nouvelle date *
                    </label>
                    <input
                      type="date"
                        value={replanifyForm.nouvelleDate}
                        onChange={(e) => setReplanifyForm(prev => ({ ...prev, nouvelleDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                    {/* Heure */}
                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                        Nouvelle heure *
                    </label>
                      <input
                        type="time"
                        value={replanifyForm.nouvelleHeure}
                        onChange={(e) => setReplanifyForm(prev => ({ ...prev, nouvelleHeure: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                      />
                  </div>

                    {/* Motif de replanification */}
                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                        Motif de la replanification *
                    </label>
                    <textarea
                        rows={4}
                        value={replanifyForm.motif}
                        onChange={(e) => setReplanifyForm(prev => ({ ...prev, motif: e.target.value }))}
                        placeholder="Expliquez pourquoi vous souhaitez replanifier ce rendez-vous..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    />
                  </div>

                </div>
              </div>
            </div>

              {/* Pied avec actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-3 sm:p-6 border-t border-gray-200 bg-gray-50">
              <button
                  onClick={closeReplanifyModal}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-[#1B263B]/60 border border-[#1B263B]/20 rounded-lg hover:bg-[#1B263B]/5 transition-colors"
              >
                Annuler
              </button>
              <button
                  onClick={handleReplanifySubmit}
                  disabled={!isReplanifyValid()}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg transition-colors ${
                    isReplanifyValid() 
                      ? 'text-white bg-[#F86F4D] hover:bg-[#F86F4D]/90' 
                      : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                  }`}
                >
                  Proposer la replanification
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Modal de création de compte rendu */}
      <AnimatePresence>
        {isCompteRenduModalOpen && selectedRendezVous && (
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
                      {selectedRendezVous.compteRendu && !isModifyingCompteRendu ? "Compte-rendu du rendez-vous" : 
                       isModifyingCompteRendu ? "Modifier le compte-rendu" : "Créer un compte-rendu"}
                  </h2>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedRendezVous.client} - {selectedRendezVous.equide}
                  </p>
                  <p className="text-xs text-gray-500">
                      {formatDate(selectedRendezVous.date)} à {selectedRendezVous.heure}
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
                {selectedRendezVous.compteRendu && !isModifyingCompteRendu ? (
                  // Affichage du compte rendu existant
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">État général de l'équidé</h4>
                      <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRendezVous.compteRendu.etatGeneral}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Observations cliniques</h4>
                      <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRendezVous.compteRendu.observations}</p>
                    </div>
                    
                    {selectedRendezVous.compteRendu.procedures && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Procédures effectuées</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRendezVous.compteRendu.procedures}</p>
                  </div>
                    )}
                    
                    {selectedRendezVous.compteRendu.medicaments && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Médicaments administrés</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRendezVous.compteRendu.medicaments}</p>
                </div>
                    )}
                    
                    {selectedRendezVous.compteRendu.recommandations && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Recommandations</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRendezVous.compteRendu.recommandations}</p>
                    </div>
                    )}
                    
                    {selectedRendezVous.compteRendu.suivi && (
                      <div>
                        <h4 className="text-xs font-medium text-[#1B263B]/70 mb-2">Suivi recommandé</h4>
                        <p className="text-xs sm:text-sm text-[#1B263B] bg-gray-50 rounded-lg p-2 sm:p-3">{selectedRendezVous.compteRendu.suivi}</p>
                    </div>
                    )}
                  </div>
                ) : (
                  // Formulaire de création
                <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                      État général de l'équidé *
                    </label>
                    <textarea
                      rows={3}
                        value={compteRenduForm.etatGeneral}
                        onChange={(e) => setCompteRenduForm(prev => ({ ...prev, etatGeneral: e.target.value }))}
                        placeholder="Décrivez l'état général de l'équidé lors de votre intervention..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                      Observations cliniques *
                    </label>
                    <textarea
                      rows={4}
                        value={compteRenduForm.observations}
                        onChange={(e) => setCompteRenduForm(prev => ({ ...prev, observations: e.target.value }))}
                        placeholder="Décrivez vos observations cliniques, symptômes observés, examens effectués..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                      Procédures effectuées *
                    </label>
                    <textarea
                      rows={3}
                        value={compteRenduForm.procedures}
                        onChange={(e) => setCompteRenduForm(prev => ({ ...prev, procedures: e.target.value }))}
                        placeholder="Listez les procédures, soins ou traitements effectués..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                      Médicaments administrés *
                    </label>
                    <textarea
                      rows={2}
                        value={compteRenduForm.medicaments}
                        onChange={(e) => setCompteRenduForm(prev => ({ ...prev, medicaments: e.target.value }))}
                        placeholder="Listez les médicaments, posologies et mode d'administration..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                      Recommandations *
                    </label>
                    <textarea
                      rows={3}
                        value={compteRenduForm.recommandations}
                        onChange={(e) => setCompteRenduForm(prev => ({ ...prev, recommandations: e.target.value }))}
                        placeholder="Recommandations pour le propriétaire (soins, surveillance, précautions...)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                      Suivi recommandé *
                    </label>
                    <textarea
                      rows={2}
                        value={compteRenduForm.suivi}
                        onChange={(e) => setCompteRenduForm(prev => ({ ...prev, suivi: e.target.value }))}
                        placeholder="Prochaines étapes, rendez-vous de suivi recommandés..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                )}
            </div>

              {/* Pied avec actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-3 sm:p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeCompteRenduModal}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-[#1B263B]/60 border border-[#1B263B]/20 rounded-lg hover:bg-[#1B263B]/5 transition-colors"
              >
                  {selectedRendezVous.compteRendu && !isModifyingCompteRendu ? "Fermer" : "Annuler"}
              </button>
                {(!selectedRendezVous.compteRendu || isModifyingCompteRendu) && (
              <button
                    onClick={handleCompteRenduSubmit}
                    disabled={!isCompteRenduValid()}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg transition-colors ${
                      isCompteRenduValid() 
                        ? 'text-white bg-[#F86F4D] hover:bg-[#F86F4D]/90' 
                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {isModifyingCompteRendu ? "Mettre à jour le compte-rendu" : "Créer le compte-rendu"}
              </button>
                )}
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}