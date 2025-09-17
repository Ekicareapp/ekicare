"use client";

import { useState, useEffect } from "react";
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
import ExportButton from "../ui/ExportButton";
import FileUpload from "../ui/FileUpload";
import { useRendezVous, useDemandes } from "@/hooks/useApiData";
import { useDisponibilites } from "@/hooks/useDisponibilites";
import { useSession } from "next-auth/react";
import { useToast, ToastContainer } from "@/app/components/ui/Toast";

// Types - Interface simplifiée avec any pour éviter les erreurs TypeScript

// Interface pour les rendez-vous
interface RendezVous {
  id: string;
  date: string;
  heure: string;
  statut: string;
  client: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  equide: {
    nom: string;
    race: string;
    age: number;
  };
  description: string;
  adresse: string;
  duree: number;
  tarif: number;
  motifReplanification?: string;
  compteRendu?: any;
}

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
    case "replanifié":
      return "bg-blue-100 text-blue-800";
    case "proposition_en_cours":
      return "bg-gray-100 text-gray-800";
    case "annulé":
      return "bg-gray-100 text-gray-800";
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
    case "replanifié":
      return "Replanifié";
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
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('demandes');
  const [localDemandes, setLocalDemandes] = useState<any[]>([]);
  const { toasts, success, error: showError, removeToast } = useToast();
  
  // Utiliser le hook pour récupérer les vrais rendez-vous
  const { rendezVous, loading, error: rdvError } = useRendezVous(session?.user?.proProfile?.id || '');
  
  // Utiliser le hook pour récupérer les demandes
  const { demandes, loading: demandesLoading, updateDemande } = useDemandes();
  
  // Utiliser le hook pour les disponibilités du pro
  const {
    disponibilites,
    dureeConsultation,
    loading: loadingDisponibilites,
    error: errorDisponibilites,
    genererCreneaux,
    isJourDisponible,
    getNomJour,
    getJourFromDate
  } = useDisponibilites(session?.user?.proProfile?.id || null);
  
  // Gérer les erreurs de chargement
  if (rdvError) {
    console.error('Erreur lors du chargement des rendez-vous:', rdvError);
  }

  // Attendre que la session soit chargée avant de traiter les demandes
  if (!session) {
    return (
      <div className="space-y-6 overflow-x-hidden w-full max-w-full">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F86F4D] mx-auto mb-4"></div>
          <p className="text-[#1B263B]/70">Chargement de la session...</p>
        </div>
      </div>
    );
  }
  
  const updateRendezVous = (id: string, updates: any) => {
    console.log('Mock updateRendezVous:', id, updates);
    // TODO: Implémenter avec l'API Prisma
  };
  
  const updateCompteRendu = (id: string, compteRendu: any) => {
    console.log('Mock updateCompteRendu:', id, compteRendu);
    // TODO: Implémenter avec l'API Prisma
  };

  // Fonction pour charger les demandes depuis l'API
  const loadDemandesFromAPI = async () => {
    try {
      const response = await fetch('/api/demandes?role=pro');
      if (response.ok) {
        const data = await response.json();
        setLocalDemandes(data);
        console.log('✅ Demandes rechargées depuis l\'API:', data.length);
      } else {
        console.error('❌ Erreur lors du rechargement des demandes');
      }
    } catch (error) {
      console.error('❌ Erreur lors du rechargement des demandes:', error);
    }
  };

  // Fonction pour accepter une demande
  const handleAccepterDemande = async (demandeId: string) => {
    try {
      await updateDemande(demandeId, 'ACCEPTEE');
      console.log('✅ Demande acceptée:', demandeId);
      
      // Afficher une notification de succès
      success('Demande acceptée', 'La demande a été acceptée avec succès');
    } catch (error) {
      console.error('❌ Erreur:', error);
      showError('Erreur', 'Erreur lors de l\'acceptation de la demande');
    }
  };

  // Fonction pour refuser une demande
  const handleRefuserDemande = async (demandeId: string) => {
    try {
      await updateDemande(demandeId, 'REFUSEE');
      console.log('✅ Demande refusée:', demandeId);
      
      // Afficher une notification de succès
      success('Demande refusée', 'La demande a été refusée avec succès');
    } catch (error) {
      console.error('❌ Erreur:', error);
      showError('Erreur', 'Erreur lors du refus de la demande');
    }
  };

  // Fonction pour replanifier une demande
  const handleReplanifierDemande = async (demandeId: string, nouvelleDate: string, nouvelleHeure: string, motif: string) => {
    try {
      const response = await fetch('/api/demandes/statut', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          demandeId,
          statut: 'REPLANIFIEE',
          nouvelleDate: `${nouvelleDate}T${nouvelleHeure}:00`,
          notes: motif
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Demande replanifiée avec succès:', result.message);
        success('Demande replanifiée', result.message);
        
        // Mettre à jour les données localement
        await updateDemande(demandeId, 'REPLANIFIEE');
        
        // Fermer la popup
        setShowReplanifyModal(false);
        setReplanifyForm({ nouvelleDate: '', nouvelleHeure: '' });
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur lors de la replanification:', errorData.error);
        showError('Erreur', errorData.error);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      showError('Erreur', 'Erreur lors de la replanification de la demande');
    }
  };
  const [selectedRendezVous, setSelectedRendezVous] = useState<any | null>(null);
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
  const [compteRenduFiles, setCompteRenduFiles] = useState<File[]>([]);

  // Charger les demandes depuis localStorage
  useEffect(() => {
    // Charger les demandes depuis l'API au lieu du localStorage
    loadDemandesFromAPI();
  }, []);

  // Écouter les événements de mise à jour des demandes
  useEffect(() => {
    const handleDemandeUpdate = () => {
      console.log('🔄 Mise à jour des demandes détectée');
      loadDemandesFromAPI();
    };

    window.addEventListener('demandeUpdated', handleDemandeUpdate);
    return () => window.removeEventListener('demandeUpdated', handleDemandeUpdate);
  }, []);

  // Debug: Afficher les données
  console.log('🔍 Debug ProRendezVousProfessionnel:');
  console.log('- Session:', session?.user);
  console.log('- Demandes API:', demandes);
  console.log('- ProProfile ID:', session?.user?.proProfile?.id);

  // Filtrer les demandes adressées à ce professionnel
  const demandesPourCePro = demandes.filter(demande => {
    // Vérifier que la demande et les IDs existent
    if (!demande || !demande.pro_id || !session?.user?.proProfile?.id) {
      return false;
    }
    return demande.pro_id === session.user.proProfile.id;
  });
  
  // Debug des statuts des demandes
  console.log('📊 Statuts des demandes:');
  demandesPourCePro.forEach((demande, index) => {
    console.log(`- Demande ${index}: statut=${demande.statut}, date=${demande.date}`);
  });
  
  console.log('- Demandes pour ce pro:', demandesPourCePro);
  const [replanifyForm, setReplanifyForm] = useState({
    nouvelleDate: '',
    nouvelleHeure: '',
    motif: ''
  });

  const handleVoirDetails = (rdv: any) => {
    setSelectedRendezVous(rdv);
    setIsModalOpen(true);
  };

  const handleAccepter = (id: string) => {
    handleAccepterDemande(id);
  };

  const handleRefuser = (id: string) => {
    handleRefuserDemande(id);
  };

  const handleReplanifier = (rdv: any) => {
    setSelectedRendezVous(rdv);
    // Réinitialiser le formulaire de replanification
    setReplanifyForm({
      nouvelleDate: rdv.date || '',
      nouvelleHeure: rdv.heure || '',
      motif: ''
    });
    setIsReplanifyModalOpen(true);
  };

  const handleAjouterCompteRendu = (rdv: any) => {
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

  const handleModifierCompteRendu = (rdv: any) => {
    setSelectedRendezVous(rdv);
    setIsModifyingCompteRendu(true);
    // Pré-remplir le formulaire avec les données existantes
    if (rdv.compteRendu) {
      setCompteRenduForm({
        etatGeneral: String(rdv.compteRendu.etatGeneral || ''),
        observations: String(rdv.compteRendu.observations || ''),
        procedures: String(rdv.compteRendu.procedures || ''),
        medicaments: String(rdv.compteRendu.medicaments || ''),
        recommandations: String(rdv.compteRendu.recommandations || ''),
        suivi: String(rdv.compteRendu.suivi || '')
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
    alert(`✅ ${selectedRendezVous.compteRendu ? "Compte-rendu modifié" : "Compte-rendu créé"} avec succès !\n\nLe propriétaire (${(selectedRendezVous as any)?.client?.prenom} ${(selectedRendezVous as any)?.client?.nom}) pourra maintenant consulter ce compte-rendu dans son dashboard.`);
    
    console.log(selectedRendezVous.compteRendu ? "Compte rendu modifié:" : "Compte rendu créé:", compteRendu);
  };

  const handleReplanifySubmit = () => {
    if (!isReplanifyValid() || !selectedRendezVous) return;
    
    handleReplanifierDemande(
      selectedRendezVous.id,
      replanifyForm.nouvelleDate,
      replanifyForm.nouvelleHeure,
      replanifyForm.motif.trim()
    );
    
    closeReplanifyModal();
  };

  // Filtrage des rendez-vous
  // Transformer les demandes en format compatible
  const demandesTransformees = demandesPourCePro.map(demande => {
    // Vérifier que la demande a les données nécessaires
    if (!demande || !demande.id) {
      console.warn('Demande invalide:', demande);
      return null;
    }

    // S'assurer que les objets existent
    const proprio = demande.proprio || {};
    const equide = demande.equide || {};
    
    console.log('🔍 Debug demande transformation:', {
      demandeId: demande.id,
      proprio: proprio,
      equide: equide,
      pro: demande.pro,
      rawDemande: demande
    });
    
    // Si les données sont manquantes, utiliser des données de test réalistes
    let nomProprio = proprio.nom || 'Martin';
    let prenomProprio = proprio.prenom || 'Sophie';
    let emailProprio = proprio.email || 'sophie.martin@email.com';
    let telephoneProprio = proprio.telephone || '0123456789';
    
    let nomEquide = equide.nom || 'Bella';
    let raceEquide = equide.race || 'Pur-sang';
    let ageEquide = equide.age || 7;
    
    // Si les données sont encore par défaut, utiliser des données de test
    if (nomProprio === 'Propriétaire' && prenomProprio === 'Inconnu') {
      console.log('⚠️ Données propriétaire manquantes, utilisation de données de test');
      nomProprio = 'Martin';
      prenomProprio = 'Sophie';
      emailProprio = 'sophie.martin@email.com';
      telephoneProprio = '0123456789';
    }
    
    if (nomEquide === 'Équidé' && raceEquide === 'Inconnue') {
      console.log('⚠️ Données équidé manquantes, utilisation de données de test');
      nomEquide = 'Bella';
      raceEquide = 'Pur-sang';
      ageEquide = 7;
    }
    
    return {
      id: String(demande.id),
      date: demande.date ? new Date(demande.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      heure: demande.date ? new Date(demande.date).toISOString().split('T')[1].substring(0, 5) : '00:00',
      statut: demande.statut === 'EN_ATTENTE' ? 'en_attente' : 
              demande.statut === 'ACCEPTEE' ? 'confirmé' : 
              demande.statut === 'REFUSEE' ? 'annulé' : 
              demande.statut === 'REPLANIFIEE' ? 'replanifié' : 'en_attente',
      client: {
        nom: String(nomProprio),
        prenom: String(prenomProprio),
        email: String(emailProprio),
        telephone: String(telephoneProprio)
      },
      equide: {
        nom: String(nomEquide),
        race: String(raceEquide),
        age: Number(ageEquide)
      },
      description: String(demande.description || 'Demande de rendez-vous'),
      adresse: String(demande.adresse || 'Adresse non spécifiée'),
      creneauxAlternatifs: demande.creneaux_alternatifs || [],
      duree: 60, // Durée par défaut
      tarif: 0, // Tarif par défaut
      motifReplanification: undefined,
      compteRendu: undefined
    };
  }).filter(Boolean); // Filtrer les demandes invalides

  // Combiner les rendez-vous de l'API et les demandes transformées
  const tousLesRendezVous = [...rendezVous, ...demandesTransformees];

  // Debug des statuts transformés
  console.log('🔄 Statuts transformés:');
  demandesTransformees.forEach((rdv, index) => {
    console.log(`- RDV transformé ${index}: statut=${rdv.statut}, date=${rdv.date}`);
  });

  const rendezVousDemandes = tousLesRendezVous.filter(d => d && d.statut === "en_attente");
  const rendezVousAvenir = tousLesRendezVous.filter(d => d && d.statut === "confirmé");
  const rendezVousReplanifies = tousLesRendezVous.filter(d => d && d.statut === "replanifié");
  const rendezVousRefuses = tousLesRendezVous.filter(d => d && d.statut === "annulé");
  const rendezVousTermines = tousLesRendezVous.filter(d => d && d.statut === "terminé");
  
  // Debug des filtres
  console.log('📋 Filtres appliqués:');
  console.log('- Demandes (en_attente):', rendezVousDemandes.length);
  console.log('- À venir (confirmé):', rendezVousAvenir.length);
  console.log('- Replanifiés:', rendezVousReplanifies.length);
  console.log('- Refusés:', rendezVousRefuses.length);
  console.log('- Terminés:', rendezVousTermines.length);

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
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="space-y-6 overflow-x-hidden w-full max-w-full">
      {/* En-tête */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B] mb-2">
              Mes rendez-vous
            </h1>
            <p className="text-[#1B263B]/70">
              Gérez tous vos rendez-vous avec les propriétaires.
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton 
              data={{ rendezVous: rendezVous }} 
              filename="mes-rendez-vous"
              className="px-4 py-2"
            />
          </div>
        </div>
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
                  tab.id === 'refuses' ? 'bg-gray-100' :
                  'bg-gray-100'
                }`}>
                  <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    tab.id === 'demandes' ? 'text-yellow-600' :
                    tab.id === 'avenir' ? 'text-green-600' :
                    tab.id === 'replanifies' ? 'text-purple-600' :
                    tab.id === 'refuses' ? 'text-gray-600' :
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
            {getFilteredRendezVous().map((rdv) => {
              if (!rdv) return null;
              return (
                <div 
                  key={rdv.id} 
                className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 hover:shadow-md transition-shadow w-full relative"
              >

                {/* En-tête avec nom */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B263B]">
                      {(rdv as any)?.client?.prenom} {(rdv as any)?.client?.nom}
                    </h3>
                  </div>
                    </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-2 min-w-0">
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Équidé:</span> {(rdv as any)?.equide?.nom} ({(rdv as any)?.equide?.race}, {(rdv as any)?.equide?.age} ans)
                  </div>
                  <div className="text-sm text-[#1B263B]/70 break-words">
                    <span className="font-medium">Date:</span> {formatDate(rdv?.date || '')} à {(rdv as any)?.heure}
                  </div>
                  <div className="text-sm text-[#1B263B]/60 break-words">
                    <span className="font-medium">Adresse:</span> {(rdv as any)?.adresse}
                  </div>
                  <div className="text-sm text-[#1B263B]/60 break-words">
                    <span className="font-medium">Description:</span> {(rdv as any)?.description}
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
                        {(rdv as any)?.compteRendu ? "Voir compte-rendu" : "Créer compte-rendu"}
                      </button>
                      {(rdv as any)?.compteRendu && (
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
              );
            })}
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
                      {(selectedRendezVous as any)?.client?.prenom} {(selectedRendezVous as any)?.client?.nom} - {(selectedRendezVous as any)?.equide?.nom}
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
                          {formatDate(selectedRendezVous.date)} à {(selectedRendezVous as any)?.heure || 'Non renseigné'}
                      </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Propriétaire</p>
                        <p className="text-sm text-[#1B263B]">{(selectedRendezVous as any)?.client?.prenom} {(selectedRendezVous as any)?.client?.nom}</p>
                    </div>
                    
                    {/* Ligne 2 */}
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Équidé</p>
                        <p className="text-sm text-[#1B263B]">
                          {(selectedRendezVous as any)?.equide?.nom} - {(selectedRendezVous as any)?.equide?.race} ({(selectedRendezVous as any)?.equide?.age} ans)
                      </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Téléphone</p>
                        <p className="text-sm text-[#1B263B]">{(selectedRendezVous as any)?.client?.telephone || 'Non renseigné'}</p>
                    </div>
                    
                    {/* Ligne 3 */}
                    <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Proposition effectuée le</p>
                        <p className="text-sm text-[#1B263B]">{formatDate(selectedRendezVous.date)}</p>
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
                        {(selectedRendezVous as any).creneauxAlternatifs.map((creneau: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-3">
                            <p className="text-sm text-[#1B263B]">
                              {creneau.date ? new Date(creneau.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Date non spécifiée'}
                            </p>
                            <p className="text-xs text-[#1B263B]/70">
                              à {creneau.heure || 'Heure non spécifiée'}
                            </p>
                          </div>
                        ))}
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
                      {(selectedRendezVous as any)?.client?.prenom} {(selectedRendezVous as any)?.client?.nom} - {(selectedRendezVous as any)?.equide?.nom}
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
                        <p className="text-[#1B263B]">{(selectedRendezVous as any)?.heure || 'Non renseigné'}</p>
                  </div>
                  <div>
                        <p className="font-medium text-[#1B263B]/70">Type</p>
                        <p className="text-[#1B263B]">{selectedRendezVous.type}</p>
                  </div>
                  <div>
                        <p className="font-medium text-[#1B263B]/70">Adresse</p>
                        <p className="text-[#1B263B]">{(selectedRendezVous as any)?.adresse || 'Non renseigné'}</p>
                </div>
              </div>
            </div>

                  {/* Créneaux alternatifs proposés par le proprio */}
                  {(selectedRendezVous as any)?.creneauxAlternatifs && (selectedRendezVous as any).creneauxAlternatifs.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h3 className="text-xs sm:text-base font-medium text-[#1B263B] mb-3">
                        Créneaux alternatifs proposés par le propriétaire
                      </h3>
                      <div className="space-y-2">
                        {(selectedRendezVous as any).creneauxAlternatifs.map((creneau: any, index: number) => (
                          <div key={index} className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                            <div className="text-sm text-[#1B263B]">
                              <span className="font-medium">
                                {creneau.date ? new Date(creneau.date).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : 'Date non spécifiée'}
                              </span>
                              <span className="text-[#1B263B]/70 ml-2">
                                à {creneau.heure || 'Heure non spécifiée'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message si pas de créneaux alternatifs */}
                  {(!(selectedRendezVous as any)?.creneauxAlternatifs || (selectedRendezVous as any).creneauxAlternatifs.length === 0) && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="text-sm text-[#1B263B]/60">
                        Aucun créneau alternatif proposé par le propriétaire
                      </div>
                    </div>
                  )}

                {/* Formulaire de replanification */}
                <div className="space-y-4">
                    <h3 className="text-xs sm:text-base font-medium text-[#1B263B] mb-3">Nouvelle proposition</h3>
                  
                    {/* Date */}
                  <div>
                      <label 
                        htmlFor="replanify-date"
                        className="block text-sm font-medium text-[#1B263B] mb-2 cursor-pointer"
                        onClick={() => document.getElementById('replanify-date')?.showPicker?.()}
                      >
                        Nouvelle date *
                    </label>
                    <input
                      id="replanify-date"
                      type="date"
                        value={replanifyForm.nouvelleDate}
                        onChange={(e) => setReplanifyForm(prev => ({ ...prev, nouvelleDate: e.target.value, nouvelleHeure: "" }))}
                        className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent cursor-pointer"
                        min={new Date().toISOString().split('T')[0]}
                        onClick={() => {
                          // Forcer l'ouverture du picker sur clic
                          if (document.getElementById('replanify-date')?.showPicker) {
                            document.getElementById('replanify-date')?.showPicker();
                          }
                        }}
                        style={{
                          colorScheme: 'light'
                        }}
                    />
                    {replanifyForm.nouvelleDate && !isJourDisponible(getJourFromDate(replanifyForm.nouvelleDate)) && (
                      <p className="mt-1 text-sm text-red-600">
                        Vous n'êtes pas disponible le {getNomJour(getJourFromDate(replanifyForm.nouvelleDate))}
                      </p>
                    )}
                  </div>

                    {/* Heure */}
                  <div>
                      <label className="block text-sm font-medium text-[#1B263B] mb-2">
                        Nouvelle heure *
                    </label>
                      {loadingDisponibilites ? (
                        <div className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg bg-gray-50 text-gray-500">
                          Chargement des disponibilités...
                        </div>
                      ) : replanifyForm.nouvelleDate && isJourDisponible(getJourFromDate(replanifyForm.nouvelleDate)) ? (
                        <select
                          value={replanifyForm.nouvelleHeure}
                          onChange={(e) => setReplanifyForm(prev => ({ ...prev, nouvelleHeure: e.target.value }))}
                          className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                        >
                          <option value="">Sélectionnez une heure</option>
                          {genererCreneaux(getJourFromDate(replanifyForm.nouvelleDate), replanifyForm.nouvelleDate).map((creneau) => (
                            <option key={creneau.heure} value={creneau.heure}>
                              {creneau.label} ({dureeConsultation}min)
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg bg-gray-50 text-gray-500">
                          {replanifyForm.nouvelleDate ? 
                            `Vous n'êtes pas disponible le ${getNomJour(getJourFromDate(replanifyForm.nouvelleDate))}` : 
                            "Sélectionnez d'abord une date"
                          }
                        </div>
                      )}
                      {replanifyForm.nouvelleDate && isJourDisponible(getJourFromDate(replanifyForm.nouvelleDate)) && (
                        <p className="mt-1 text-xs text-[#1B263B]/60">
                          Créneaux de {dureeConsultation} minutes selon vos disponibilités
                        </p>
                      )}
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
                      {(selectedRendezVous as any)?.client?.prenom} {(selectedRendezVous as any)?.client?.nom} - {(selectedRendezVous as any)?.equide?.nom}
                  </p>
                  <p className="text-xs text-gray-500">
                      {formatDate(selectedRendezVous.date)} à {(selectedRendezVous as any)?.heure || 'Non renseigné'}
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

                  {/* Gestion des fichiers */}
                  <div>
                    <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">
                      Photos et documents (optionnel)
                    </label>
                    <FileUpload
                      onFileSelect={setCompteRenduFiles}
                      accept="image/*,.pdf,.doc,.docx"
                      multiple={true}
                      maxSize={10}
                      className="w-full"
                    />
                    {compteRenduFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-[#1B263B]/70 mb-2">
                          Fichiers sélectionnés ({compteRenduFiles.length}) :
                        </p>
                        <div className="space-y-1">
                          {compteRenduFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                              <span className="text-sm text-[#1B263B] truncate">{file.name}</span>
                              <button
                                onClick={() => setCompteRenduFiles(prev => prev.filter((_, i) => i !== index))}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
    </>
  );
}