"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarIcon, 
  ClockIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  XMarkIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

interface RendezVous {
  id: string;
  date: string;
  heure?: string;
  statut: string;
  notes?: string;
  client?: {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
    adresse?: string;
    ville?: string;
  };
  equide?: {
    id: string;
    nom: string;
    age: number;
    race: string;
  };
}

interface RendezVousParJour {
  [jour: string]: RendezVous[];
}

interface VueMensuelleCompacteProps {
  rendezVous?: RendezVous[];
  demandesAcceptees?: any[];
  loading?: boolean;
}

export default function VueMensuelleCompacte({ 
  rendezVous: propsRendezVous = [], 
  demandesAcceptees = [], 
  loading = false 
}: VueMensuelleCompacteProps) {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null);
  const [isReplanifierModalOpen, setIsReplanifierModalOpen] = useState(false);
  const [rdvToReplanifier, setRdvToReplanifier] = useState<RendezVous | null>(null);
  const [replanifierFormData, setReplanifierFormData] = useState({
    nouvelleDate: '',
    nouvelleHeure: '',
    raison: ''
  });

  useEffect(() => {
    console.log('🔍 Debug VueMensuelleCompacte - useEffect:');
    console.log('- Props rendez-vous:', propsRendezVous);
    console.log('- Props demandes acceptées:', demandesAcceptees);
    console.log('- Loading:', loading);
    console.log('- Type de propsRendezVous:', typeof propsRendezVous);
    console.log('- Est un array:', Array.isArray(propsRendezVous));
    console.log('- Longueur:', propsRendezVous?.length);
    
    // Log détaillé de chaque rendez-vous
    if (propsRendezVous && propsRendezVous.length > 0) {
      console.log('🔍 Détail des rendez-vous reçus:');
      propsRendezVous.forEach((rdv, index) => {
        console.log(`- RDV ${index}:`, {
          id: rdv.id,
          date: rdv.date,
          statut: rdv.statut,
          client: rdv.client?.nom || 'N/A'
        });
      });
    }
    
    // Vérifier que les données sont valides
    const validRendezVous = Array.isArray(propsRendezVous) ? propsRendezVous : [];
    const validDemandesAcceptees = Array.isArray(demandesAcceptees) ? demandesAcceptees : [];
    
    console.log('- validRendezVous:', validRendezVous);
    console.log('- validDemandesAcceptees:', validDemandesAcceptees);
    
    if (validRendezVous.length > 0) {
      // Utiliser directement les rendez-vous passés en props (déjà transformés)
      console.log('- ✅ Utilisation des rendez-vous reçus en props:', validRendezVous);
      setRendezVous(validRendezVous);
      setIsLoading(false);
    } else if (validDemandesAcceptees.length > 0) {
      // Fallback: convertir les demandes acceptées si pas de rendez-vous en props
      const demandesAsRendezVous = validDemandesAcceptees
        .filter(demande => demande && demande.id)
        .map(demande => {
          const createValidDate = (dateValue: any) => {
            if (!dateValue) return new Date().toISOString().split('T')[0];
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) {
              console.warn('Date invalide détectée:', dateValue);
              return new Date().toISOString().split('T')[0];
            }
            return date.toISOString().split('T')[0];
          };

          const createValidTime = (dateValue: any) => {
            if (!dateValue) return '00:00';
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) {
              console.warn('Heure invalide détectée:', dateValue);
              return '00:00';
            }
            return date.toISOString().split('T')[1].substring(0, 5);
          };

          return {
            id: demande.id,
            date: createValidDate(demande.date || demande.start_at),
            heure: createValidTime(demande.start_at),
            statut: demande.statut === 'ACCEPTEE' ? 'accepted' : 
                    demande.statut === 'EN_ATTENTE' ? 'pending' :
                    demande.statut === 'REFUSEE' ? 'rejected' : 'pending',
            notes: demande.description || `Demande ${demande.statut || 'en attente'}`,
            client: demande.proprio ? {
              id: demande.proprio.id,
              nom: demande.proprio.nom || 'Client',
              prenom: demande.proprio.prenom || '',
              telephone: demande.proprio.telephone || '',
              adresse: demande.adresse || '',
              ville: demande.proprio.ville || ''
            } : undefined,
            equide: demande.equide ? {
              id: demande.equide.id,
              nom: demande.equide.nom || 'Équidé',
              age: demande.equide.age || 0,
              race: demande.equide.race || 'Inconnue'
            } : undefined
          };
        });
      
      console.log('- Rendez-vous convertis depuis demandes:', demandesAsRendezVous);
      setRendezVous(demandesAsRendezVous);
      setIsLoading(false);
    } else {
      // Si pas de données en props, essayer l'API
      fetchRendezVous();
    }
  }, [propsRendezVous, demandesAcceptees]);

  // Rafraîchir les données quand le mois change
  useEffect(() => {
    if (propsRendezVous.length > 0 || demandesAcceptees.length > 0) {
      // Les données sont déjà mises à jour par l'effet précédent
      return;
    }
    fetchRendezVous();
  }, [currentMonth]);

  const getEmptyData = (): RendezVous[] => {
    // Données vides - sera rempli par l'API
    return [];
  };

  const fetchRendezVous = async () => {
    try {
      const response = await fetch('/api/rendez-vous?role=pro');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous');
      }
      const data = await response.json();
      
      // Si l'API retourne des données, on les utilise
      if (data && data.length > 0) {
        setRendezVous(data);
      } else {
        // Sinon, on utilise les données vides
        setRendezVous(getEmptyData());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous, utilisation des données vides:', error);
      // En cas d'erreur, on utilise les données vides
      setRendezVous(getEmptyData());
    } finally {
      setIsLoading(false);
    }
  };

  const getRendezVousDuMois = () => {
    const debutMois = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const finMois = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const rdvDuMois = rendezVous.filter(rdv => {
      const dateRdv = new Date(rdv.date);
      const isInMonth = dateRdv >= debutMois && dateRdv <= finMois;
      return isInMonth;
    });
    
    return rdvDuMois;
  };

  const organiserParJour = (rdvList: RendezVous[]): RendezVousParJour => {
    const rdvParJour: RendezVousParJour = {};
    
    rdvList.forEach(rdv => {
      const dateRdv = new Date(rdv.date);
      const jour = dateRdv.getDate().toString().padStart(2, '0');
      
      if (!rdvParJour[jour]) {
        rdvParJour[jour] = [];
      }
      rdvParJour[jour].push(rdv);
    });

    // Trier les rendez-vous par heure pour chaque jour
    Object.keys(rdvParJour).forEach(jour => {
      rdvParJour[jour].sort((a, b) => {
        const heureA = new Date(a.date).getHours() * 60 + new Date(a.date).getMinutes();
        const heureB = new Date(b.date).getHours() * 60 + new Date(b.date).getMinutes();
        return heureA - heureB;
      });
    });

    return rdvParJour;
  };

  const changerMois = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const nouveauMois = new Date(prev);
      if (direction === 'prev') {
        nouveauMois.setMonth(nouveauMois.getMonth() - 1);
      } else {
        nouveauMois.setMonth(nouveauMois.getMonth() + 1);
      }
      return nouveauMois;
    });
  };

  const allerAuMoisActuel = () => {
    setCurrentMonth(new Date());
  };

  const allerASeptembre2025 = () => {
    setCurrentMonth(new Date(2025, 8, 1)); // Septembre 2025 (mois 8 = septembre)
  };

  const handleVoirDetails = (rdv: RendezVous) => {
    setSelectedRdv(rdv);
  };

  const closeModal = () => {
    setSelectedRdv(null);
  };

  const handleAccepter = async (rdvId: string) => {
    try {
      const response = await fetch(`/api/rendez-vous/${rdvId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'confirmé' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'acceptation du rendez-vous');
      }

      // Mettre à jour l'état local
      setRendezVous(prev => 
        prev.map(rdv => 
          rdv.id === rdvId ? { ...rdv, statut: 'confirmé' } : rdv
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
    }
  };

  const handleRefuser = async (rdvId: string) => {
    try {
      const response = await fetch(`/api/rendez-vous/${rdvId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'annulé' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du refus du rendez-vous');
      }

      // Mettre à jour l'état local
      setRendezVous(prev => 
        prev.map(rdv => 
          rdv.id === rdvId ? { ...rdv, statut: 'annulé' } : rdv
        )
      );
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  const handleReplanifier = (rdv: RendezVous) => {
    setRdvToReplanifier(rdv);
    setReplanifierFormData({
      nouvelleDate: '',
      nouvelleHeure: '',
      raison: ''
    });
    setIsReplanifierModalOpen(true);
  };

  const closeReplanifierModal = () => {
    setIsReplanifierModalOpen(false);
    setRdvToReplanifier(null);
    setReplanifierFormData({
      nouvelleDate: '',
      nouvelleHeure: '',
      raison: ''
    });
  };

  const handleSoumettreReplanification = async () => {
    if (rdvToReplanifier && replanifierFormData.nouvelleDate && replanifierFormData.nouvelleHeure && replanifierFormData.raison) {
      try {
        // Ici on pourrait appeler une API pour replanifier
        console.log('Replanifier rendez-vous:', {
          rdvId: rdvToReplanifier.id,
          nouvelleDate: replanifierFormData.nouvelleDate,
          nouvelleHeure: replanifierFormData.nouvelleHeure,
          raison: replanifierFormData.raison
        });
        
        // Mettre à jour l'état local
        setRendezVous(prev => 
          prev.map(rdv => 
            rdv.id === rdvToReplanifier.id ? { 
              ...rdv, 
              date: new Date(`${replanifierFormData.nouvelleDate}T${replanifierFormData.nouvelleHeure}`).toISOString()
            } : rdv
          )
        );
        
        closeReplanifierModal();
      } catch (error) {
        console.error('Erreur lors de la replanification:', error);
      }
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'confirmé':
        return 'bg-green-100 text-green-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'confirmé':
        return 'Confirmé';
      case 'annulé':
        return 'Annulé';
      case 'en_attente':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  const formatHeure = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const rdvDuMois = getRendezVousDuMois();
  const rdvParJour = organiserParJour(rdvDuMois);
  const joursAvecRdv = Object.keys(rdvParJour).sort((a, b) => parseInt(a) - parseInt(b));

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
        <div className="mx-auto h-8 w-8 rounded-lg bg-[#F86F4D] flex items-center justify-center mb-3">
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-sm text-[#1B263B]/70">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1B263B] mb-1">
            Vue mensuelle ({rdvDuMois.length} rendez-vous)
          </h2>
          <p className="text-sm text-[#1B263B]/70">
            Aperçu de vos rendez-vous du mois
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changerMois('prev')}
            className="p-1.5 text-[#1B263B]/70 hover:text-[#F86F4D] hover:bg-[#F86F4D]/10 rounded transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          
          <div className="text-center min-w-[120px]">
            <p className="text-sm font-medium text-[#1B263B]">
              {currentMonth.toLocaleDateString('fr-FR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={allerAuMoisActuel}
                className="text-xs text-[#F86F4D] hover:text-[#e55a3a] transition-colors"
              >
                Mois actuel
              </button>
              <button
                onClick={allerASeptembre2025}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sept 2025
              </button>
            </div>
          </div>
          
          <button
            onClick={() => changerMois('next')}
            className="p-1.5 text-[#1B263B]/70 hover:text-[#F86F4D] hover:bg-[#F86F4D]/10 rounded transition-colors"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Rendez-vous par jour */}
      {joursAvecRdv.length === 0 ? (
        <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
          <div className="mx-auto h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="font-medium text-[#1B263B] mb-1">Aucun rendez-vous</h3>
          <p className="text-sm text-[#1B263B]/70">Ce mois-ci</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {joursAvecRdv.map((jour) => (
            <motion.div
              key={jour}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-[#1B263B]/10 overflow-hidden"
            >
              {/* En-tête du jour */}
              <div className="bg-[#F86F4D]/5 border-b border-[#1B263B]/10 px-4 py-2">
                <h3 className="text-sm font-semibold text-[#1B263B]">
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), parseInt(jour)).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </h3>
                <p className="text-xs text-[#1B263B]/70">
                  {rdvParJour[jour].length} rendez-vous
                </p>
              </div>

              {/* Liste des rendez-vous du jour */}
              <div className="divide-y divide-[#1B263B]/5">
                {rdvParJour[jour].map((rdv) => (
                  <motion.div
                    key={rdv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <ClockIcon className="h-4 w-4 text-[#F86F4D] flex-shrink-0" />
                          <span className="text-sm font-medium text-[#1B263B]">
                            {formatHeure(rdv.date)}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatutColor(rdv.statut)}`}>
                            {getStatutLabel(rdv.statut)}
                          </span>
                        </div>
                        <p className="text-sm text-[#1B263B]/80 truncate">
                          {rdv.client ? `${rdv.client.prenom} ${rdv.client.nom}` : 'Client inconnu'} - {rdv.equide?.nom || 'Équidé inconnu'}
                        </p>
                        <p className="text-xs text-[#1B263B]/60">
                          {rdv.notes || 'Consultation'}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => handleVoirDetails(rdv)}
                        className="p-1.5 text-[#1B263B]/70 hover:text-[#F86F4D] hover:bg-[#F86F4D]/10 transition-colors ml-2 rounded"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Détails */}
      <AnimatePresence>
        {selectedRdv && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#1B263B]">
                    Détails du rendez-vous
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="sr-only">Fermer</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#1B263B]/70 mb-1">Type de service</p>
                    <p className="text-[#1B263B]">{selectedRdv.notes || 'Consultation'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B263B]/70 mb-1">Date et heure</p>
                    <p className="text-[#1B263B]">
                      {new Date(selectedRdv.date).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B263B]/70 mb-1">Statut</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(selectedRdv.statut)}`}>
                      {getStatutLabel(selectedRdv.statut)}
                    </span>
                  </div>
                </div>

                {/* Informations client */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-[#1B263B] mb-3">Informations client</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F86F4D]/10 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-[#F86F4D]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">
                          {selectedRdv.client ? `${selectedRdv.client.prenom} ${selectedRdv.client.nom}` : 'Client inconnu'}
                        </p>
                        <p className="text-xs text-[#1B263B]/60">Client</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F86F4D]/10 rounded-full flex items-center justify-center">
                        <PhoneIcon className="h-4 w-4 text-[#F86F4D]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">
                          {selectedRdv.client?.telephone || 'Téléphone non disponible'}
                        </p>
                        <p className="text-xs text-[#1B263B]/60">Téléphone</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F86F4D]/10 rounded-full flex items-center justify-center">
                        <MapPinIcon className="h-4 w-4 text-[#F86F4D]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">
                          {selectedRdv.client?.adresse && selectedRdv.client?.ville ? `${selectedRdv.client.adresse}, ${selectedRdv.client.ville}` : 'Adresse non disponible'}
                        </p>
                        <p className="text-xs text-[#1B263B]/60">Adresse</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations équidé */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-[#1B263B] mb-3">Informations équidé</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Nom</p>
                        <p className="text-sm text-[#1B263B]">{selectedRdv.equide?.nom || 'Équidé inconnu'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Âge</p>
                        <p className="text-sm text-[#1B263B]">{selectedRdv.equide?.age || 'N/A'} ans</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 mb-1">Race</p>
                        <p className="text-sm text-[#1B263B]">{selectedRdv.equide?.race || 'Non spécifiée'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedRdv.notes && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-medium text-[#1B263B] mb-3">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-[#1B263B]/80">
                        {selectedRdv.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedRdv.statut === 'en_attente' && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          handleAccepter(selectedRdv.id);
                          closeModal();
                        }}
                        className="flex-1 px-4 py-2 bg-[#F86F4D] text-white text-sm font-medium rounded-lg hover:bg-[#e55a3a] transition-colors flex items-center justify-center"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Accepter
                      </button>
                      <button
                        onClick={() => {
                          handleRefuser(selectedRdv.id);
                          closeModal();
                        }}
                        className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Refuser
                      </button>
                      <button
                        onClick={() => {
                          handleReplanifier(selectedRdv);
                          closeModal();
                        }}
                        className="flex-1 px-4 py-2 text-[#F86F4D] border border-[#F86F4D] text-sm font-medium rounded-lg hover:bg-[#F86F4D]/10 transition-colors flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Replanifier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de replanification */}
      <AnimatePresence>
        {isReplanifierModalOpen && rdvToReplanifier && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReplanifierModal}
          >
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#1B263B]">
                    Replanifier le rendez-vous
                  </h2>
                  <button
                    onClick={closeReplanifierModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="sr-only">Fermer</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations actuelles */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-[#1B263B] mb-2">Rendez-vous actuel</h3>
                  <p className="text-sm text-[#1B263B]/80">
                    {new Date(rdvToReplanifier.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-[#1B263B]/60 mt-1">
                    {rdvToReplanifier.client ? `${rdvToReplanifier.client.prenom} ${rdvToReplanifier.client.nom}` : 'Client inconnu'} - {rdvToReplanifier.equide?.nom || 'Équidé inconnu'}
                  </p>
                </div>


                {/* Formulaire de replanification */}
                <div className="space-y-4">
                  <h3 className="font-medium text-[#1B263B]">Proposer un nouveau créneau</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-1">
                        Nouvelle date
                      </label>
                      <input
                        type="date"
                        value={replanifierFormData.nouvelleDate}
                        onChange={(e) => setReplanifierFormData(prev => ({ ...prev, nouvelleDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1B263B]/70 mb-1">
                        Nouvelle heure
                      </label>
                      <select
                        value={replanifierFormData.nouvelleHeure}
                        onChange={(e) => setReplanifierFormData(prev => ({ ...prev, nouvelleHeure: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors bg-white"
                      >
                        <option value="">Sélectionner une heure</option>
                        <option value="08:00">08:00</option>
                        <option value="08:30">08:30</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="13:00">13:00</option>
                        <option value="13:30">13:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                        <option value="17:00">17:00</option>
                        <option value="17:30">17:30</option>
                        <option value="18:00">18:00</option>
                        <option value="18:30">18:30</option>
                        <option value="19:00">19:00</option>
                        <option value="19:30">19:30</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B263B]/70 mb-1">
                      Raison de la replanification
                    </label>
                    <textarea
                      value={replanifierFormData.raison}
                      onChange={(e) => setReplanifierFormData(prev => ({ ...prev, raison: e.target.value }))}
                      rows={3}
                      placeholder="Expliquez pourquoi vous devez replanifier ce rendez-vous..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                  <button
                    onClick={closeReplanifierModal}
                    className="flex-1 sm:flex-none px-4 py-2 text-[#1B263B]/60 border border-[#1B263B]/20 rounded-lg hover:bg-[#1B263B]/5 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSoumettreReplanification}
                    disabled={!replanifierFormData.nouvelleDate || !replanifierFormData.nouvelleHeure || !replanifierFormData.raison}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#e55a3a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Envoyer la replanification
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
