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

// Données des tournées (mock pour le design)
const mockTournees = [
  {
    id: "tournee-1",
    nom: "Tournée Paris Est",
    date: "2025-01-20",
    heureDebut: "09:00",
    heureFin: "12:00",
    statut: "planifiee",
    clients: [
      {
        nom: "Marie Dubois",
        adresse: "123 Rue des Écuries, 75012 Paris",
        heure: "09:30",
        type: "Vaccination",
        equide: "Thunder (8 ans)",
        motif: "Vaccination annuelle contre la grippe équine"
      },
      {
        nom: "Pierre Martin",
        adresse: "45 Avenue des Chevaux, 75012 Paris",
        heure: "11:00",
        type: "Consultation",
        equide: "Bella (12 ans)",
        motif: "Contrôle de routine et surveillance du poids"
      }
    ],
    distance: "15 km",
    duree: "3h",
    economie: "30 min"
  },
  {
    id: "tournee-2",
    nom: "Tournée Lyon Sud",
    date: "2025-01-21",
    heureDebut: "14:00",
    heureFin: "17:00",
    statut: "en_cours",
    clients: [
      {
        nom: "Sophie Laurent",
        adresse: "78 Chemin des Écuries, 69000 Lyon",
        heure: "14:30",
        type: "Vermifugation",
        equide: "Spirit (6 ans)",
        motif: "Vermifuge à large spectre"
      }
    ],
    distance: "12 km",
    duree: "3h",
    economie: "20 min"
  },
  {
    id: "tournee-3",
    nom: "Tournée Marseille Centre",
    date: "2025-01-18",
    heureDebut: "10:00",
    heureFin: "13:00",
    statut: "terminee",
    clients: [
      {
        nom: "Jean Dupont",
        adresse: "12 Boulevard des Chevaux, 13000 Marseille",
        heure: "10:30",
        type: "Consultation",
        equide: "Luna (10 ans)",
        motif: "Contrôle post-opératoire"
      }
    ],
    distance: "8 km",
    duree: "3h",
    economie: "15 min"
  }
];

// Données des suggestions IA (mock pour le design)
const mockAiSuggestions = [
  {
    id: "suggestion-1", 
    nom: "Tournée IA - Paris Ouest",
    date: "2025-01-22",
    heureDebut: "09:00",
    heureFin: "12:00",
    statut: "suggestion",
    clients: [
      {
        nom: "Claire Moreau", 
        adresse: "56 Rue des Écuries, 75016 Paris", 
        heure: "09:30",
        type: "Vaccination",
        equide: "Thunder (8 ans - Pur-sang)",
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
      equide: string;
      motif: string;
    }>
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTournee(null);
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

  const handleVoirDetails = (tournee: any) => {
    setSelectedTournee(tournee);
    setIsModalOpen(true);
    resetTourneeState();
  };

  const handleSuggestionsIA = () => {
    // Générer une nouvelle suggestion IA
    const newSuggestion = {
      id: `suggestion-${Date.now()}`,
      nom: `Tournée IA - ${new Date().toLocaleDateString('fr-FR')}`,
      date: new Date().toISOString().split('T')[0],
      heureDebut: "09:00",
      heureFin: "12:00",
      statut: "suggestion",
      clients: [
        {
          nom: "Client IA",
          adresse: "Adresse générée par IA",
          heure: "09:30",
          type: "Consultation",
          equide: "Équidé IA",
          notes: "Suggestion générée automatiquement"
        }
      ],
      distance: "15 km",
      duree: "3h",
      economie: "30 min",
      score: Math.floor(Math.random() * 20) + 80
    };
    
    setAiSuggestions(prev => [...prev, newSuggestion]);
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
    closeModal();
  };

  const handleTerminerTournee = (tourneeId: string) => {
    setTournees(prev => prev.map(tournee => 
      tournee.id === tourneeId 
        ? { ...tournee, statut: 'terminee' }
        : tournee
    ));
    closeModal();
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

  const getStats = () => {
    const total = tournees.length + aiSuggestions.length;
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Suggestions</p>
              <p className="text-lg sm:text-xl font-bold text-[#1B263B]">{aiSuggestions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Planifiées</p>
              <p className="text-lg sm:text-xl font-bold text-[#1B263B]">{stats.planifiees}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">En cours</p>
              <p className="text-lg sm:text-xl font-bold text-[#1B263B]">{stats.enCours}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Terminées</p>
              <p className="text-lg sm:text-xl font-bold text-[#1B263B]">{stats.terminees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleSuggestionsIA}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 transition-colors text-sm font-medium"
        >
          <SparklesIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Suggestions IA</span>
          <span className="sm:hidden">IA</span>
        </button>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-[#1B263B]/20 text-[#1B263B] rounded-lg hover:bg-[#1B263B]/5 transition-colors text-sm font-medium"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Créer une tournée</span>
        </button>
      </div>

      {/* Tournées List */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Informations principales */}
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#1B263B]">
                          {tournee.nom}
                        </h3>
                        <p className="text-sm text-[#1B263B]/70">
                          {new Date(tournee.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} à {tournee.heureDebut} - {tournee.heureFin}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          filterStatut === 'suggestions' 
                            ? 'bg-orange-100 text-orange-800'
                            : filterStatut === 'ignoree'
                              ? 'bg-gray-100 text-gray-800'
                              : selectedTournee?.statut === 'planifiee' 
                                ? 'bg-blue-100 text-blue-800' 
                                : selectedTournee?.statut === 'en_cours'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                        }`}>
                          {filterStatut === 'suggestions' 
                            ? 'Suggestion' 
                            : filterStatut === 'ignoree'
                              ? 'Ignoré'
                              : tournee.statut === 'planifiee' 
                                ? 'Planifiée' 
                                : tournee.statut === 'en_cours' 
                                  ? 'En cours' 
                                  : 'Terminée'}
                        </span>
                      </div>
                    </div>

                    {/* Informations détaillées */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4 text-[#1B263B]/50" />
                        <span className="text-sm text-[#1B263B]/70">
                          {tournee.clients?.length || 0} client{(tournee.clients?.length || 0) > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-4 w-4 text-[#1B263B]/50" />
                        <span className="text-sm text-[#1B263B]/70">
                          {tournee.distance} km
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-[#1B263B]/50" />
                        <span className="text-sm text-[#1B263B]/70">
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

      {/* Modal de détails */}
      <AnimatePresence>
        {isModalOpen && selectedTournee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B263B]">{selectedTournee.nom}</h2>
                  <p className="text-sm text-[#1B263B]/70">
                    {new Date(selectedTournee.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} à {selectedTournee.heureDebut} - {selectedTournee.heureFin}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-[#1B263B]/50 hover:text-[#1B263B] hover:bg-[#1B263B]/5 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Informations de la tournée */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                  <p className="text-sm text-[#1B263B]/70">Distance</p>
                  <p className="font-medium">{selectedTournee.distance}</p>
                </div>
              </div>

              {/* Suggestion IA (si applicable) */}
              {filterStatut === 'suggestions' && (
                <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10 mb-6">
                  <h3 className="font-medium text-[#1B263B] mb-3">Suggestion IA</h3>
                  <p className="text-sm text-[#1B263B]/70 mb-4">
                    Optimisation automatique de votre tournée basée sur l'analyse des distances et des créneaux horaires
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#1B263B]/10">
                      <ClockIcon className="h-5 w-5 text-[#F86F4D]" />
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">Temps économisé</p>
                        <p className="text-xs text-[#1B263B]/70">{selectedTournee.economie}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#1B263B]/10">
                      <MapPinIcon className="h-5 w-5 text-[#1B263B]" />
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">Distance optimisée</p>
                        <p className="text-xs text-[#1B263B]/70">{selectedTournee.distance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Liste des clients */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#1B263B]">Clients ({selectedTournee.clients?.length || 0})</h3>
                <div className="space-y-3">
                  {selectedTournee.clients?.map((client: any, index: number) => {
                    const isClientEnCours = filterStatut === 'en_cours' && index === clientActuelIndex;
                    const isClientTermine = filterStatut === 'en_cours' && clientsTermines.has(index);
                    
                    return (
                      <div 
                        key={index}
                        className={`bg-gray-50 rounded-lg p-4 ${
                          isClientEnCours 
                            ? 'border-2 border-[#F86F4D] shadow-lg' 
                            : 'border border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-[#1B263B]">{client.nom}</h4>
                              {isClientEnCours && (
                                <span className="px-2 py-1 bg-[#F86F4D] text-white text-xs rounded-full">
                                  EN COURS
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#1B263B]/70 mb-1">
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
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 mt-6">
                {filterStatut === 'suggestions' ? (
                  // Actions pour les suggestions
                  <>
                    <button
                      onClick={() => handleAccepterSuggestion(selectedTournee.id)}
                      className="flex-1 px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#e55a3a] transition-colors"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => handleIgnorerSuggestion(selectedTournee.id)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
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
                      onClick={() => handleDemarrerTournee(selectedTournee.id)}
                      className="flex-1 px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#e55a3a] transition-colors"
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
    </div>
  );
}

