"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapIcon, 
  PlusIcon,
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  PlayIcon,
  StopIcon
} from "@heroicons/react/24/outline";

// Données des rendez-vous acceptés (mock pour le design)
const mockRendezVousAcceptes = [
  {
    id: "1",
    client: "Marie Dubois",
    equide: "Thunder (8 ans)",
    adresse: "123 Rue des Écuries, 75012 Paris",
    date: new Date().toISOString().split('T')[0],
    heure: "14:30",
    type: "Vaccination",
    motif: "Vaccination annuelle contre la grippe équine",
    telephone: "06 12 34 56 78",
    statut: "accepte"
  },
  {
    id: "2", 
    client: "Pierre Martin",
    equide: "Bella (12 ans)",
    adresse: "45 Avenue des Chevaux, 69000 Lyon",
    date: new Date().toISOString().split('T')[0],
    heure: "16:00",
    type: "Consultation",
    motif: "Contrôle de routine et surveillance du poids",
    telephone: "06 23 45 67 89",
    statut: "accepte"
  }
];

// Données mock des tournées
const mockTournees = [
  {
    id: "1",
    nom: "Tournée Paris Est",
    date: "2025-01-15",
    heureDebut: "14:00",
    heureFin: "18:00",
    statut: "planifiee",
    clients: [
      {
        nom: "Marie Dubois",
        adresse: "123 Rue des Écuries, 75012 Paris", 
        heure: "14:30",
        type: "Vaccination annuelle",
        motif: "Vaccination contre la grippe équine et vérification des rappels",
        equide: "Thunder (8 ans - Selle Français)",
        notes: "Première vaccination, vérifier les antécédents"
      },
      { 
        nom: "Pierre Martin",
        adresse: "45 Avenue des Chevaux, 69000 Lyon", 
        heure: "16:00",
        type: "Consultation de routine",
        motif: "Contrôle post-opératoire et surveillance des points de suture",
        equide: "Bella (12 ans - Pur-sang)",
        notes: "Contrôle post-opératoire, surveillance des points de suture"
      }
    ],
    distance: "25 km",
    duree: "4h"
  },
  {
    id: "2",
    nom: "Tournée Marseille Centre",
    date: "2025-01-16", 
    heureDebut: "09:00",
    heureFin: "12:00",
    statut: "terminee",
    clients: [
      {
        nom: "Sophie Laurent", 
        adresse: "78 Chemin des Écuries, 13000 Marseille", 
        heure: "09:30",
        type: "Vermifugation",
        motif: "Administration du vermifuge à large spectre et contrôle du poids",
        equide: "Spirit (6 ans - Arabe)",
        notes: "Vermifuge à large spectre, prévoir bandages si nécessaire"
      }
    ],
    distance: "15 km",
    duree: "3h"
  },
  {
    id: "3",
    nom: "Tournée Toulouse Ouest",
    date: "2025-01-17",
    heureDebut: "10:00",
    heureFin: "13:00",
    statut: "en_cours",
    clients: [
      {
        nom: "Jean Bernard", 
        adresse: "12 Route de la Ferme, 31000 Toulouse", 
        heure: "10:30",
        type: "Visite de contrôle",
        equide: "Max (15 ans - Trotteur)",
        notes: "Suivi médical, attention particulière aux articulations"
      }
    ],
    distance: "20 km",
    duree: "3h"
  }
];

// Données mock des suggestions IA
const mockAiSuggestions = [
  {
    id: "suggestion-1",
    nom: "Tournée IA - Paris Nord",
    date: "2025-01-18",
    heureDebut: "09:00",
    heureFin: "12:00",
    statut: "suggestion",
    clients: [
      {
        nom: "Marie Dubois", 
        adresse: "123 Rue des Écuries, 75012 Paris", 
        heure: "09:30",
        type: "Vaccination",
        equide: "Thunder (8 ans - Selle Français)",
        notes: "Vaccin annuel, prévoir tranquillisant si nécessaire"
      },
      { 
        nom: "Pierre Martin",
        adresse: "45 Avenue des Chevaux, 69000 Lyon", 
        heure: "10:30",
        type: "Consultation",
        equide: "Bella (12 ans - Pur-sang)",
        notes: "Contrôle de routine, surveillance du poids"
      }
    ],
    distance: "18 km",
    duree: "3h",
    economie: "45 min",
    score: 92
  },
  {
    id: "suggestion-2", 
    nom: "Tournée IA - Lyon Sud",
    date: "2025-01-19",
    heureDebut: "14:00",
    heureFin: "17:00",
    statut: "suggestion",
    clients: [
      {
        nom: "Sophie Laurent", 
        adresse: "78 Chemin des Écuries, 13000 Marseille", 
        heure: "14:30",
        type: "Vermifugation",
        equide: "Spirit (6 ans - Arabe)",
        notes: "Vermifuge à large spectre, attention aux allergies connues"
      }
    ],
    distance: "12 km",
    duree: "3h",
    economie: "30 min",
    score: 88
  }
];

export default function ProTourneesReal() {
  const [filterStatut, setFilterStatut] = useState("suggestions");
  const [tournees, setTournees] = useState(mockTournees);
  const [aiSuggestions, setAiSuggestions] = useState(mockAiSuggestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournee, setSelectedTournee] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  // Fonctions de base
  const handleVoirDetails = (tournee: any) => {
    setSelectedTournee(tournee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTournee(null);
  };

  const handleCreateTournee = () => {
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
        return aiSuggestions;
      case 'planifiee':
        return tournees.filter(t => t.statut === 'planifiee');
      case 'en_cours':
        return tournees.filter(t => t.statut === 'en_cours');
      case 'terminee':
        return tournees.filter(t => t.statut === 'terminee');
      case 'ignoree':
        return tournees.filter(t => t.statut === 'ignoree');
      default:
        return aiSuggestions;
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
                { id: 'ignoree', label: 'Ignoré', count: tournees.filter(t => t.statut === 'ignoree').length }
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
              <button
                onClick={handleSuggestionsIA}
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:py-3 text-[#1B263B] bg-white border border-[#1B263B]/20 rounded-lg transition-colors hover:bg-[#1B263B]/5 text-sm"
              >
                <SparklesIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Suggestions IA</span>
                <span className="sm:hidden">IA</span>
              </button>

              <button
                onClick={handleCreateTournee}
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
          {getFilteredTournees().length > 0 ? (
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
                          className="flex-1 sm:flex-none px-3 py-2 text-[#1B263B]/70 hover:text-[#F86F4D] hover:bg-[#F86F4D]/10 border border-[#1B263B]/20 hover:border-[#F86F4D]/30 rounded-lg transition-all text-sm"
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
                              onClick={() => {/* TODO: Ignorer suggestion */}}
                              className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Ignorer
                            </button>
                          </>
                        )}
                        {filterStatut === 'planifiee' && (
                          <button 
                            onClick={() => {/* TODO: Ignorer tournée */}}
                            className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Ignorer
                          </button>
                        )}
                        {filterStatut === 'en_cours' && (
                          <button 
                            onClick={() => {/* TODO: Marquer comme terminée */}}
                            className="flex-1 sm:flex-none px-3 py-2 bg-[#F86F4D] text-white text-sm rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                          >
                            Terminer
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

      {/* Popup de détails */}
      <AnimatePresence>
        {isModalOpen && selectedTournee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                    <MapIcon className="w-6 h-6 text-[#F86F4D]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-[#1B263B] truncate">
                      {selectedTournee.nom}
                    </h2>
                    <p className="text-sm text-[#1B263B]/70">
                      {new Date(selectedTournee.date).toLocaleDateString('fr-FR')} • {selectedTournee.heureDebut} - {selectedTournee.heureFin}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Contenu */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="w-5 h-5 text-[#F86F4D]" />
                        <span className="font-medium text-[#1B263B]">Clients</span>
                      </div>
                      <p className="text-2xl font-bold text-[#1B263B]">{selectedTournee.clients.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPinIcon className="w-5 h-5 text-[#F86F4D]" />
                        <span className="font-medium text-[#1B263B]">Distance</span>
                      </div>
                      <p className="text-2xl font-bold text-[#1B263B]">{selectedTournee.distance}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ClockIcon className="w-5 h-5 text-[#F86F4D]" />
                        <span className="font-medium text-[#1B263B]">Durée</span>
                      </div>
                      <p className="text-2xl font-bold text-[#1B263B]">{selectedTournee.duree}</p>
                    </div>
                  </div>

                  {/* Détails des rendez-vous */}
                  <div>
                    <h3 className="font-medium text-[#1B263B] mb-4">Détails des rendez-vous</h3>
                    <div className="space-y-4">
                      {selectedTournee.clients.map((client: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-[#1B263B]">{client.nom}</h4>
                            <span className="text-sm text-gray-500">{client.heure}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{client.equide}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            {client.adresse}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{client.motif}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

