"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTournees } from "@/hooks/useApiData";
import { 
  MapIcon, 
  PlusIcon,
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UserIcon,
  UserGroupIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  PlayIcon,
  StopIcon,
  CurrencyDollarIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import ExportButton from "../ui/ExportButton";

// Interface pour les suggestions IA
interface AiSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

export default function ProTourneesReal() {
  const [filterStatut, setFilterStatut] = useState("suggestions");
  const { tournees, loading: tourneesLoading, error: tourneesError, createTournee, updateTournee, deleteTournee } = useTournees();
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournee, setSelectedTournee] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clientActuelIndex, setClientActuelIndex] = useState(0);
  const [clientsTermines, setClientsTermines] = useState<Set<number>>(new Set());
  const [suggestionsIgnorees, setSuggestionsIgnorees] = useState<Set<string>>(new Set());
  const [createFormData, setCreateFormData] = useState({
    nom: '',
    date: '',
    mode: 'existing' as 'existing' | 'advance',
    clients: [] as Array<{
      nom: string;
      adresse: string;
      heure: string;
      type: string;
      motif: string;
      equide: string;
      date?: string;
    }>
  });
  const [rendezVousSelectionnes, setRendezVousSelectionnes] = useState<Set<string>>(new Set());

  // Fonctions de base
  const handleVoirDetails = (tournee: any) => {
    setSelectedTournee(tournee);
    resetTourneeState();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTournee(null);
  };

  const openCreateModal = () => {
    setCreateFormData({
      nom: '',
      date: '',
      mode: 'existing',
      clients: []
    });
    setIsCreateModalOpen(true);
  };

  const handleSuggestionsIA = () => {
    // Générer de nouvelles suggestions IA
    const newSuggestion = {
      id: `suggestion-${Date.now()}`,
      nom: `Tournée IA - Optimisée ${new Date().toLocaleDateString('fr-FR')}`,
      date: "2025-01-20",
      heureDebut: "10:00",
      heureFin: "13:00",
      statut: "suggestion",
      clients: [
        { 
          nom: "Alice Dupont", 
          adresse: "45 Rue des Écuries, 75013 Paris", 
          heure: "10:30",
          type: "Consultation urgente",
          motif: "Problème respiratoire, examen approfondi nécessaire",
          equide: "Shadow (10 ans - Frison)",
          notes: "Problème respiratoire, examen approfondi nécessaire"
        }
      ],
      distance: "22 km",
      duree: "3h",
      economie: "35 min",
      score: 89
    };
    
    setAiSuggestions(prev => [...prev, newSuggestion]);
    setFilterStatut('suggestions');
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      nom: '',
      date: '',
      mode: 'existing',
      clients: []
    });
    setRendezVousSelectionnes(new Set());
  };

  const handleAccepterSuggestion = (suggestionId: string) => {
    const suggestion = aiSuggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const nouvelleTournee = {
        ...suggestion,
        id: `tournee-${Date.now()}`,
        statut: 'planifiee'
      };
      setTournees(prev => [...prev, nouvelleTournee]);
      setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    }
  };

  const handleIgnorerSuggestion = (suggestionId: string) => {
    // Marquer la suggestion comme ignorée
    setSuggestionsIgnorees(prev => new Set([...prev, suggestionId]));
    closeModal();
  };

  const handleDemarrerTournee = (tourneeId: string) => {
    setTournees(prev => prev.map(tournee => 
      tournee.id === tourneeId 
        ? { ...tournee, statut: 'en_cours' }
        : tournee
    ));
  };

  const handleTerminerTournee = (tourneeId: string) => {
    setTournees(prev => prev.map(tournee => 
      tournee.id === tourneeId 
        ? { ...tournee, statut: 'terminee' }
        : tournee
    ));
  };

  const handleClientTermine = () => {
    const currentClientIndex = clientActuelIndex;
    
    // Marquer le client actuel comme terminé
    setClientsTermines(prev => new Set([...prev, currentClientIndex]));
    
    // Ne pas passer automatiquement au client suivant
    // Le pro doit cliquer sur chaque bouton "Terminé" individuellement
  };

  const resetTourneeState = () => {
    setClientActuelIndex(0);
    setClientsTermines(new Set());
  };

  const handleRendezVousSelection = (rdvId: string) => {
    setRendezVousSelectionnes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rdvId)) {
        newSet.delete(rdvId);
      } else {
        newSet.add(rdvId);
      }
      return newSet;
    });
  };

  const handleCreateTournee = () => {
    if (!createFormData.nom || !createFormData.date || rendezVousSelectionnes.size === 0) {
      return;
    }

    const selectedRendezVous = tournees.filter(rdv => 
      rendezVousSelectionnes.has(rdv.id)
    );

    const nouvelleTournee = {
      id: `tournee-${Date.now()}`,
      nom: createFormData.nom,
      date: createFormData.date,
      heureDebut: selectedRendezVous[0]?.heure || "09:00",
      heureFin: selectedRendezVous[selectedRendezVous.length - 1]?.heure || "17:00",
      statut: "planifiee",
      clients: selectedRendezVous.map(rdv => ({
        nom: rdv.client,
        adresse: rdv.adresse,
        heure: rdv.heure,
        type: rdv.type,
        equide: rdv.equide,
        motif: rdv.motif,
        notes: rdv.motif // Utiliser le motif comme notes par défaut
      })),
      distance: "Calculé automatiquement",
      duree: "Calculé automatiquement",
      economie: "0 min"
    };

    setTournees(prev => [...prev, nouvelleTournee]);
    closeCreateModal();
  };

  const getRendezVousByMonth = () => {
    const grouped = tournees.reduce((acc, rdv) => {
      const date = new Date(rdv.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          name: monthName,
          rendezVous: []
        };
      }
      acc[monthKey].rendezVous.push(rdv);
      return acc;
    }, {} as Record<string, { name: string; rendezVous: any[] }>);

    return Object.values(grouped).sort((a, b) => 
      new Date(a.rendezVous[0].date).getTime() - new Date(b.rendezVous[0].date).getTime()
    );
  };

  const getStats = () => {
    const total = tournees.length;
    const planifiees = tournees.filter(t => t.statut === 'planifiee').length;
    const enCours = tournees.filter(t => t.statut === 'en_cours').length;
    const terminees = tournees.filter(t => t.statut === 'terminee').length;
    const ignorees = tournees.filter(t => t.statut === 'ignoree').length;
    
    return { total, planifiees, enCours, terminees, ignorees };
  };

  const getFilteredTournees = () => {
    switch (filterStatut) {
      case 'suggestions':
        return aiSuggestions.filter(suggestion => !suggestionsIgnorees.has(suggestion.id));
      case 'planifiee':
        return tournees.filter(t => t.statut === 'planifiee');
      case 'en_cours':
        return tournees.filter(t => t.statut === 'en_cours');
      case 'terminee':
        return tournees.filter(t => t.statut === 'terminee');
      case 'ignoree':
        return aiSuggestions.filter(suggestion => suggestionsIgnorees.has(suggestion.id));
      default:
        return aiSuggestions.filter(suggestion => !suggestionsIgnorees.has(suggestion.id));
    }
  };

  const stats = getStats();

    return (
    <div className="space-y-4 sm:space-y-6" style={{ maxWidth: 'calc(100vw - 2rem)', overflowX: 'hidden' }}>
      {/* Header */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B]">Mes tournées</h1>
        <p className="text-sm sm:text-base text-[#1B263B]/70 mt-1">
          Gérez vos tournées et planifiez vos déplacements
        </p>
          </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6" style={{ maxWidth: 'calc(100vw - 2rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-[#F86F4D]/10">
              <MapIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#F86F4D]" />
        </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Total tournées</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1B263B]">{stats.total}</p>
      </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-100">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
      </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Planifiées</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1B263B]">{stats.planifiees}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-green-100">
              <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">En cours</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1B263B]">{stats.enCours}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-gray-100">
              <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Terminées</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1B263B]">{stats.terminees}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-red-100">
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Ignorées</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1B263B]">{stats.ignorees}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card principale avec onglets et liste */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10" style={{ maxWidth: 'calc(100vw - 2rem)' }}>
        {/* Onglets et Actions */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-3 pb-3 sm:pb-3 border-b border-[#1B263B]/10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-4">
            {/* Onglets */}
            <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'suggestions', label: 'Suggestions', count: aiSuggestions.length },
                { id: 'planifiee', label: 'Planifiés', count: tournees.filter(t => t.statut === 'planifiee').length },
                { id: 'en_cours', label: 'En cours', count: tournees.filter(t => t.statut === 'en_cours').length },
                { id: 'terminee', label: 'Terminé', count: tournees.filter(t => t.statut === 'terminee').length },
                { id: 'ignoree', label: 'Ignorés', count: suggestionsIgnorees.size }
          ].map((tab) => (
            <button
                  key={tab.id}
                  onClick={() => setFilterStatut(tab.id as any)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    filterStatut === tab.id
                      ? 'bg-[#F86F4D]/10 text-[#F86F4D]'
                      : 'text-[#1B263B]/70 hover:text-[#1B263B] hover:bg-[#1B263B]/5'
              }`}
            >
              {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      filterStatut === tab.id
                        ? 'bg-[#F86F4D]/20 text-[#F86F4D]'
                        : 'bg-[#1B263B]/10 text-[#1B263B]/70'
                    }`}>
                      {tab.count}
                    </span>
                  )}
            </button>
          ))}
            </nav>

            {/* Actions */}
            <div className="flex gap-2 sm:gap-3">
              <ExportButton 
                data={{ tournees: tournees }} 
                filename="mes-tournees"
                className="px-3 py-2 sm:py-3 text-sm"
              />
              
              <button
                onClick={handleSuggestionsIA}
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:py-3 text-[#1B263B] bg-white border border-[#1B263B]/20 rounded-lg transition-colors hover:bg-[#1B263B]/5 text-sm"
              >
                <SparklesIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Suggestions IA</span>
                <span className="sm:hidden">IA</span>
              </button>

              <button
                onClick={openCreateModal}
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:py-3 text-white bg-[#F86F4D] rounded-lg transition-colors hover:bg-[#F86F4D]/90 text-sm"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Nouvelle tournée</span>
                <span className="sm:hidden">Nouvelle</span>
            </button>
          </div>
          </div>
        </div>

        {/* Liste des tournées */}
        <div className="p-4 sm:p-6">
          {tourneesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F86F4D] mx-auto mb-4"></div>
              <p className="text-[#1B263B]/70">Chargement des tournées...</p>
            </div>
          ) : tourneesError ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XMarkIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#1B263B] mb-2">
                Erreur de chargement
              </h3>
              <p className="text-[#1B263B]/70 mb-4">{tourneesError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#F86F4D] text-white rounded-md hover:bg-[#F86F4D]/90 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : getFilteredTournees().length > 0 ? (
            <div className="space-y-4">
              {/* Encart IA pour les suggestions */}
              {filterStatut === 'suggestions' && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <SparklesIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900 text-sm">Suggestions IA</h3>
                      <p className="text-xs text-blue-700">Optimisez vos tournées et gagnez du temps</p>
                    </div>
                  </div>
                </div>
              )}
              {getFilteredTournees().map((tournee, index) => (
                <div 
                  key={tournee.id}
                  className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 hover:shadow-md transition-shadow w-full"
                >
                  <div className="space-y-3 sm:space-y-4">
                    {/* En-tête avec nom et statut */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-[#F86F4D]/10 flex-shrink-0">
                            <MapIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#F86F4D]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-[#1B263B] text-sm sm:text-base truncate">
                              {tournee.nom}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#1B263B]/70 truncate">
                              {new Date(tournee.date).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })} • {tournee.heureDebut} - {tournee.heureFin}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informations principales */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-start space-x-2">
                          <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/50 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-[#1B263B]/70">
                            {tournee.clients?.length || 0} client{(tournee.clients?.length || 0) > 1 ? 's' : ''}
                          </span>
                          </div>
                        <div className="flex items-start space-x-2">
                          <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/50 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-[#1B263B]/70">
                              {tournee.distance} km
                                </span>
                          </div>
                        <div className="flex items-start space-x-2">
                          <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/50 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-[#1B263B]/70">
                            Durée: {tournee.duree}
                                </span>
                      </div>
                    </div>

                      {/* CTA selon la fenêtre */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                      <button
                        onClick={() => handleVoirDetails(tournee)}
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-lg transition-all text-sm ${
                            filterStatut === 'en_cours'
                              ? 'bg-[#F86F4D] text-white hover:bg-[#e55a3a]'
                              : 'text-[#1B263B]/70 hover:text-[#F86F4D] hover:bg-[#F86F4D]/10 border border-[#1B263B]/20 hover:border-[#F86F4D]/30'
                          }`}
                      >
                          Voir la tournée
                      </button>
                      {filterStatut === 'suggestions' && (
                        <>
                          <button
                            onClick={() => handleAccepterSuggestion(tournee.id)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-[#F86F4D] text-white text-sm rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                          >
                            Accepter
                          </button>
                          <button 
                              onClick={() => handleIgnorerSuggestion(tournee.id)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Ignorer
                          </button>
                        </>
                      )}
                      {filterStatut === 'planifiee' && (
                        <button 
                            onClick={() => handleDemarrerTournee(tournee.id)}
                            className="flex-1 sm:flex-none px-3 py-2 bg-[#F86F4D] text-white text-sm rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                        >
                            Démarrer
                        </button>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <MapIcon className="h-12 w-12 sm:h-16 sm:w-16 text-[#1B263B]/20 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-[#1B263B] mb-2">
                Aucune tournée trouvée
              </h3>
              <p className="text-xs sm:text-sm text-[#1B263B]/70 mb-6 px-4">
                Vous n'avez pas encore de tournées dans cette catégorie.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails */}
      <AnimatePresence>
        {isModalOpen && selectedTournee && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1B263B]">Détails de la tournée</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-[#1B263B]/70 hover:text-[#1B263B] transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#1B263B] mb-2">Informations générales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#1B263B]/70">Nom</p>
                      <p className="font-medium">{selectedTournee.nom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#1B263B]/70">Date et heure</p>
                      <p className="font-medium">
                        {new Date(selectedTournee.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} à {selectedTournee.heureDebut} - {selectedTournee.heureFin}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#1B263B]/70">Statut</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        filterStatut === 'suggestions' 
                          ? 'bg-orange-100 text-orange-800'
                          : filterStatut === 'ignoree'
                            ? 'bg-gray-100 text-gray-800'
                            : selectedTournee.statut === 'planifiee' 
                              ? 'bg-blue-100 text-blue-800' 
                              : selectedTournee.statut === 'en_cours'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                      }`}>
                        {filterStatut === 'suggestions' 
                          ? 'Suggestion' 
                          : filterStatut === 'ignoree'
                            ? 'Ignoré'
                            : selectedTournee.statut === 'planifiee' 
                              ? 'Planifiée' 
                              : selectedTournee.statut === 'en_cours' 
                                ? 'En cours' 
                                : 'Terminée'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-[#1B263B]/70">Durée totale</p>
                      <p className="font-medium">{selectedTournee.duree}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#1B263B]/70">Nombre de clients</p>
                      <p className="font-medium">{selectedTournee.clients.length} clients</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#1B263B]/70">Distance totale</p>
                      <p className="font-medium">{selectedTournee.distance || 'Non calculée'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B263B] mb-2">Rendez-vous</h3>
                  <div className="space-y-3">
                    {selectedTournee.clients.map((client: any, index: number) => {
                      const isClientEnCours = filterStatut === 'en_cours' && index === clientActuelIndex;
                      const isClientTermine = clientsTermines.has(index);
                      const isDernierClient = index === selectedTournee.clients.length - 1;
                      
                      return (
                        <div key={index} className={`rounded-lg p-4 ${
                          isClientEnCours 
                            ? 'bg-gray-50 border-2 border-[#F86F4D] shadow-lg' 
                            : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-medium ${
                                isClientEnCours ? 'text-[#F86F4D] font-bold' : 
                                isClientTermine ? 'text-green-600 font-bold' : 'text-[#1B263B]/60'
                              }`}>
                                {isClientTermine ? '✓ TERMINÉ' : 
                                 isClientEnCours ? 'EN COURS' : `Étape ${index + 1}`}
                              </span>
                              <h4 className={`font-medium ${
                                isClientEnCours ? 'text-[#F86F4D]' : 
                                isClientTermine ? 'text-green-600' : 'text-[#1B263B]'
                              }`}>
                                {client.nom}
                              </h4>
                            </div>
                            <span className="text-sm text-gray-500">{client.heure}</span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{client.equide}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {client.adresse}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Motif :</span> {client.motif}
                            </p>
                            {filterStatut === 'terminee' ? (
                              // Pour les tournées terminées, afficher "Client terminé !" par défaut
                              <div className="pt-2 flex justify-end">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center gap-1">
                                  <CheckIcon className="h-3 w-3" />
                                  Client terminé !
                                </span>
                              </div>
                            ) : filterStatut === 'en_cours' ? (
                              // Pour la fenêtre "En cours", logique interactive
                              <>
                                {!isClientTermine && (
                                  <div className="pt-2 flex justify-end">
                                    <button
                                      onClick={() => {
                                        // Marquer ce client spécifique comme terminé
                                        setClientsTermines(prev => new Set([...prev, index]));
                                        
                                        // Passer au client suivant si ce n'est pas le dernier
                                        if (index < selectedTournee.clients.length - 1) {
                                          setClientActuelIndex(index + 1);
                                        }
                                      }}
                                      className="px-2 py-1 bg-[#F86F4D] text-white text-xs rounded hover:bg-[#e55a3a] transition-colors flex items-center gap-1"
                                    >
                                      <CheckIcon className="h-3 w-3" />
                                      Terminé
                                    </button>
                                  </div>
                                )}
                                {isClientTermine && (
                                  <div className="pt-2 flex justify-end">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center gap-1">
                                      <CheckIcon className="h-3 w-3" />
                                      Client terminé !
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Suggestion IA */}
                {filterStatut === 'suggestions' && (
                  <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white rounded-lg border border-[#1B263B]/10">
                        <SparklesIcon className="w-5 h-5 text-[#F86F4D]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1B263B]">Suggestion IA</h3>
                        <p className="text-sm text-[#1B263B]/70">Optimisation automatique de votre tournée basée sur l'analyse des distances et des créneaux horaires</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#1B263B]/10">
                        <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                          <ClockIcon className="w-4 h-4 text-[#F86F4D]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Temps économisé</p>
                          <p className="text-sm font-bold text-green-600">30min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#1B263B]/10">
                        <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                          <MapPinIcon className="w-4 h-4 text-[#F86F4D]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Distance réduite</p>
                          <p className="text-sm font-bold text-green-600">7km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 mt-6">
                {filterStatut === 'suggestions' ? (
                  // Actions pour les suggestions
                  <>
                    <button
                      onClick={() => {
                        handleAccepterSuggestion(selectedTournee.id);
                        closeModal();
                      }}
                      className="flex-1 px-4 py-2 text-white rounded-lg transition-colors"
                      style={{backgroundColor: '#f76f4d'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e55a3a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f76f4d'}
                    >
                      <CheckIcon className="h-4 w-4 inline mr-2" />
                      Accepter
                    </button>
                    <button
                      onClick={() => {
                        handleIgnorerSuggestion(selectedTournee.id);
                        closeModal();
                      }}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4 inline mr-2" />
                      Ignorer
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Fermer
                    </button>
                  </>
                ) : filterStatut === 'planifiee' ? (
                  // Actions pour les tournées planifiées
                  <>
                    <button
                      onClick={() => {
                        handleDemarrerTournee(selectedTournee.id);
                        closeModal();
                      }}
                      className="flex-1 px-4 py-2 text-white rounded-lg transition-colors"
                      style={{backgroundColor: '#f76f4d'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e55a3a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f76f4d'}
                    >
                      <PlayIcon className="h-4 w-4 inline mr-2" />
                      Démarrer
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Fermer
                    </button>
                  </>
                ) : filterStatut === 'terminee' ? (
                  // Actions pour les tournées terminées (consultation uniquement)
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Fermer
                  </button>
                ) : filterStatut === 'ignoree' ? (
                  // Actions pour les suggestions ignorées (consultation uniquement)
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Fermer
                  </button>
                ) : (
                  // Actions pour les tournées en cours
                  (() => {
                    const tousClientsTermines = clientsTermines.size === selectedTournee.clients.length;
                    const peutTerminerTournee = tousClientsTermines;
                    
                    return (
                      <button
                        onClick={() => {
                          if (peutTerminerTournee) {
                            handleTerminerTournee(selectedTournee.id);
                          }
                          closeModal();
                        }}
                        disabled={!peutTerminerTournee}
                        className={`w-full px-4 py-2 rounded-lg transition-colors ${
                          peutTerminerTournee
                            ? 'bg-[#F86F4D] text-white hover:bg-[#e55a3a] cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {peutTerminerTournee ? 'Terminer la tournée' : 'Fermer'}
                      </button>
                    );
                  })()
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création de tournée */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={closeCreateModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B263B]">Créer une nouvelle tournée</h2>
                  <p className="text-sm text-[#1B263B]/70">
                    Sélectionnez les rendez-vous à inclure dans votre tournée
                  </p>
                </div>
                <button
                  onClick={closeCreateModal}
                  className="p-2 text-[#1B263B]/50 hover:text-[#1B263B] hover:bg-[#1B263B]/5 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Formulaire de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Nom de la tournée
                  </label>
                  <input
                    type="text"
                    value={createFormData.nom}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, nom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Ex: Tournée Paris Est"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Date de la tournée
                  </label>
                  <input
                    type="date"
                    value={createFormData.date}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sélection des rendez-vous */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1B263B] mb-4">
                  Rendez-vous disponibles ({rendezVousSelectionnes.size} sélectionné{rendezVousSelectionnes.size > 1 ? 's' : ''})
                </h3>
                
                <div className="space-y-6">
                  {getRendezVousByMonth().map((month, monthIndex) => (
                    <div key={monthIndex} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-[#1B263B] mb-3 flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-[#F86F4D]" />
                        {month.name}
                      </h4>
                      
                      <div className="space-y-3">
                        {month.rendezVous.map((rdv) => {
                          const isSelected = rendezVousSelectionnes.has(rdv.id);
                          return (
                            <div
                              key={rdv.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#F86F4D] bg-[#F86F4D]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleRendezVousSelection(rdv.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleRendezVousSelection(rdv.id)}
                                      className="w-4 h-4 text-[#F86F4D] border-gray-300 rounded focus:ring-[#F86F4D]"
                                    />
                                    <h5 className="font-medium text-[#1B263B]">{rdv.client}</h5>
                                  </div>
                                  <div className="ml-7 space-y-1">
                                    <p className="text-sm text-[#1B263B]/70">
                                      <span className="font-medium">Équidé :</span> {rdv.equide}
                                    </p>
                                    <p className="text-sm text-[#1B263B]/70">
                                      <span className="font-medium">Adresse :</span> {rdv.adresse}
                                    </p>
                                    <p className="text-sm text-[#1B263B]/70">
                                      <span className="font-medium">Motif :</span> {rdv.motif}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4 text-[#1B263B]/50" />
                                        <span className="text-sm text-[#1B263B]/70">
                                          {new Date(rdv.date).toLocaleDateString('fr-FR')}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <ClockIcon className="h-4 w-4 text-[#1B263B]/50" />
                                        <span className="text-sm text-[#1B263B]/70">{rdv.heure}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeCreateModal}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateTournee}
                  disabled={!createFormData.nom || !createFormData.date || rendezVousSelectionnes.size === 0}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    createFormData.nom && createFormData.date && rendezVousSelectionnes.size > 0
                      ? 'bg-[#F86F4D] text-white hover:bg-[#e55a3a] cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Créer la tournée ({rendezVousSelectionnes.size} rendez-vous)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

