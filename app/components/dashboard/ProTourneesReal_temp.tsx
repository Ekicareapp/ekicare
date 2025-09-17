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
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
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
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    heure: "16:00",
    type: "Consultation",
    motif: "Contrôle de routine et surveillance du poids",
    telephone: "06 23 45 67 89",
    statut: "accepte"
  },
  {
    id: "3",
    client: "Sophie Laurent",
    equide: "Spirit (6 ans)",
    adresse: "78 Chemin des Écuries, 13000 Marseille",
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    heure: "09:30",
    type: "Vermifugation",
    motif: "Administration du vermifuge à large spectre",
    telephone: "06 34 56 78 90",
    statut: "accepte"
  },
  {
    id: "4",
    client: "Alice Dupont",
    equide: "Shadow (10 ans)",
    adresse: "89 Rue des Écuries, 75013 Paris",
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    heure: "10:30",
    type: "Consultation urgente",
    motif: "Problème respiratoire, examen approfondi nécessaire",
    telephone: "06 45 67 89 01",
    statut: "accepte"
  }
];

// Données des tournées (mock pour le design)
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
  },
  {
    id: "4",
    nom: "Tournée Nice Centre",
    date: "2025-01-14",
    heureDebut: "15:00",
    heureFin: "18:00",
    statut: "ignoree",
    clients: [
      {
        nom: "Claire Moreau", 
        adresse: "67 Boulevard des Écuries, 06000 Nice", 
        heure: "15:30",
        type: "Soins dentaires",
        equide: "Luna (7 ans - Quarter Horse)",
        notes: "Nettoyage dentaire, vérifier les dents de lait"
      }
    ],
    distance: "22 km",
    duree: "3h"
        }
      ];

export default function ProTourneesReal() {
  const [filterStatut, setFilterStatut] = useState("suggestions");
  const [tournees, setTournees] = useState(mockTournees);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([
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
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournee, setSelectedTournee] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
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
        },
        { 
          nom: "Bob Martin", 
          adresse: "67 Avenue des Chevaux, 69001 Lyon", 
          heure: "11:30",
          type: "Vaccination",
          motif: "Premier vaccin, cheval sensible, prévoir sédatif léger",
          equide: "Storm (5 ans - Mustang)",
          notes: "Premier vaccin, cheval sensible, prévoir sédatif léger"
        }
      ],
      distance: "22 km",
      duree: "3h",
      economie: "35 min",
      score: 89
    };
    
    setAiSuggestions((prev: any[]) => [...prev, newSuggestion]);
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

  const handleSubmitTournee = () => {
    const isValid = createFormData.mode === 'existing' 
      ? (createFormData.nom && createFormData.clients.length > 0)
      : (createFormData.nom && createFormData.date && createFormData.clients.length > 0);
      
    if (isValid) {
      // Optimiser l'ordre des clients avec l'IA (simulation)
      const clientsOptimises = optimizeClientOrder(createFormData.clients);
      
      // Calculer l'heure de début et fin automatiquement
      const heureDebut = "08:00"; // Heure de début par défaut
      const heureFin = calculateEndTime(heureDebut, clientsOptimises.length);
      
      // Pour le mode "existing", utiliser la date du premier RDV sélectionné
      const dateTournee = createFormData.mode === 'existing' 
        ? createFormData.clients[0]?.date || new Date().toISOString().split('T')[0]
        : createFormData.date;
      
      const nouvelleTournee = {
        id: `tournee-${Date.now()}`,
        nom: createFormData.nom,
        date: dateTournee,
        heureDebut: heureDebut,
        heureFin: heureFin,
        statut: 'planifiee',
        clients: clientsOptimises,
        distance: "0 km",
        duree: "0h"
      };
      
      setTournees((prev: any[]) => [...prev, nouvelleTournee]);
      closeCreateModal();
      alert(`Nouvelle tournée créée avec succès ! L'ordre de visite a été optimisé par l'IA pour réduire les déplacements.`);
    }
  };

  // Fonction pour optimiser l'ordre des clients (simulation d'IA)
  const optimizeClientOrder = (clients: any[]) => {
    // Simulation simple d'optimisation géographique
    // Dans une vraie app, ceci utiliserait un algorithme de routage optimisé
    const heureDebut = "08:00"; // Heure de début par défaut
    const clientsAvecOrdre = clients.map((client, index) => ({
      ...client,
      ordreVisite: index + 1,
      heureOptimisee: calculateOptimalTime(heureDebut, index, clients.length)
    }));
    
    return clientsAvecOrdre;
  };

  // Calculer l'heure optimisée pour chaque client
  const calculateOptimalTime = (heureDebut: string, index: number, totalClients: number) => {
    const [heures, minutes] = heureDebut.split(':').map(Number);
    const dureeParClient = 45; // 45 minutes par client en moyenne
    const deplacement = 15; // 15 minutes de déplacement
    
    const minutesTotal = (index * (dureeParClient + deplacement));
    const nouvelleHeure = new Date();
    nouvelleHeure.setHours(heures, minutes + minutesTotal);
    
    return nouvelleHeure.toTimeString().slice(0, 5);
  };

  // Calculer l'heure de fin de tournée
  const calculateEndTime = (heureDebut: string, nombreClients: number) => {
    const [heures, minutes] = heureDebut.split(':').map(Number);
    const dureeParClient = 45; // 45 minutes par client
    const deplacement = 15; // 15 minutes de déplacement entre clients
    const tempsTotal = (nombreClients * dureeParClient) + ((nombreClients - 1) * deplacement);
    
    const nouvelleHeure = new Date();
    nouvelleHeure.setHours(heures, minutes + tempsTotal);
    
    return nouvelleHeure.toTimeString().slice(0, 5);
  };


  const closeSuggestionsModal = () => {
    setIsSuggestionsModalOpen(false);
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
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const handleIgnorerTournee = (tourneeId: string) => {
    setTournees(prev => prev.map(t => 
      t.id === tourneeId ? { ...t, statut: 'ignoree' as any } : t
    ));
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
                            onClick={() => handleIgnorerSuggestion(tournee.id)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Ignorer
                          </button>
                        </>
                      )}
                      {filterStatut === 'planifiee' && (
                        <button 
                            onClick={() => handleIgnorerTournee(tournee.id)}
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
                        {filterStatut === 'ignoree' && (
                          <button
                            onClick={() => {/* TODO: Restaurer */}}
                            className="flex-1 sm:flex-none px-3 py-2 bg-[#F86F4D] text-white text-sm rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                          >
                            Restaurer
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
                    <MapIcon className="w-5 h-5 text-[#F86F4D]" />
                  </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {selectedTournee.nom}
                </h2>
                  <p className="text-sm text-gray-600 truncate">
                      {new Date(selectedTournee.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} • {selectedTournee.heureDebut} - {selectedTournee.heureFin}
                  </p>
                </div>
              </div>
                <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                            <UserIcon className="h-4 w-4 text-[#F86F4D]" />
                    </div>
                    <div>
                            <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Clients</p>
                            <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.clients?.length || 0}</p>
                    </div>
                  </div>
                </div>

                      <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                            <MapPinIcon className="h-4 w-4 text-[#F86F4D]" />
                          </div>
                <div>
                            <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Distance</p>
                            <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.distance}</p>
                              </div>
                              </div>
                              </div>

                      <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
                            <ClockIcon className="h-4 w-4 text-[#F86F4D]" />
                            </div>
                          <div>
                            <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Durée</p>
                            <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.duree}</p>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>

                  {/* Détails des rendez-vous */}
                  {selectedTournee.clients && selectedTournee.clients.length > 0 && (
                <div>
                      <h3 className="font-medium text-[#1B263B] mb-4">Détails des rendez-vous</h3>
                      <div className="space-y-4">
                        {selectedTournee.clients.map((client: any, index: number) => {
                          const isActive = selectedTournee.statut === 'en_cours' && index === 0;
                          const isCompleted = selectedTournee.statut === 'en_cours' && index > 0;
                          const isFinished = selectedTournee.statut === 'terminee' || (selectedTournee.statut === 'en_cours' && index < 0);
                          const isCurrent = selectedTournee.statut === 'planifiee' && index === 0; // Première tournée planifiée
                          
                          return (
                            <div key={index} className="relative">
                              {/* Ligne de connexion */}
                              {index < selectedTournee.clients.length - 1 && (
                                <div className={`absolute left-6 top-16 w-0.5 h-12 ${
                                  isActive ? 'bg-orange-300' : isCurrent ? 'bg-blue-300' : 'bg-gray-300'
                                }`} />
                              )}
                              
                              {/* Cercle de statut */}
                              <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm ${
                      isActive 
                        ? 'bg-orange-500 text-white ring-4 ring-orange-100' 
                        : isCurrent
                        ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100'
                        : isCompleted || isFinished
                        ? 'bg-gray-50 text-[#1B263B]'
                        : 'bg-gray-50 text-[#1B263B]/70'
                    }`}>
                      {index + 1}
              </div>
                                
                                {/* Contenu du client */}
                                <div className={`flex-1 rounded-lg p-4 transition-all border ${
                                  isActive 
                                    ? 'bg-orange-50 border-orange-200 shadow-md' 
                                    : isCurrent
                                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                                    : isCompleted || isFinished
                                    ? 'bg-gray-50 border-[#1B263B]/10'
                                    : 'bg-gray-50 border-[#1B263B]/10'
                                }`}>
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className={`font-medium ${
                                      isActive ? 'text-orange-700' : isCurrent ? 'text-blue-700' : (isCompleted || isFinished) ? 'text-[#1B263B]' : 'text-[#1B263B]'
                                    }`}>
                                      {client.nom}
                                    </h4>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                      isActive 
                                        ? 'bg-orange-100 text-orange-700' 
                                        : isCurrent
                                        ? 'bg-blue-100 text-blue-700'
                                        : (isCompleted || isFinished)
                                        ? 'bg-[#1B263B]/10 text-[#1B263B]'
                                        : 'bg-[#1B263B]/10 text-[#1B263B]'
                                    }`}>
                                      {client.heure}
                                    </span>
            </div>

                                  <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <p className={`text-sm ${
                                        isActive ? 'text-orange-600' : (isCompleted || isFinished) ? 'text-[#1B263B]/70' : 'text-[#1B263B]/70'
                                      }`}>
                                        {client.adresse}
                                      </p>
              <button
                                        onClick={() => navigator.clipboard.writeText(client.adresse)}
                                        className="ml-1 p-1 hover:bg-gray-100 rounded transition-colors"
                                        title="Copier l'adresse"
              >
                                        <svg className="w-3 h-3 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
              </button>
            </div>
                                    
                                    <div className="flex items-start gap-2">
                                      <CalendarIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <p className={`text-sm ${
                                        isActive ? 'text-orange-600' : (isCompleted || isFinished) ? 'text-[#1B263B]/70' : 'text-[#1B263B]/70'
                                      }`}>
                                        {client.motif || client.type || 'Consultation générale'}
                                      </p>
        </div>
                                    
                                    <div className="flex items-start gap-2">
                                      <UserIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <p className={`text-sm ${
                                        isActive ? 'text-orange-600' : (isCompleted || isFinished) ? 'text-[#1B263B]/70' : 'text-[#1B263B]/70'
                                      }`}>
                                        {client.equide || 'Équidé non spécifié'}
                                      </p>
                          </div>
                        </div>
                                  
                                  {/* Badge de statut */}
                                  {isActive && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-orange-100 rounded-full">
                                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                      <span className="text-xs font-medium text-orange-700">
                                        En cours
                                      </span>
                                    </div>
                                  )}
                                  {(isCompleted || isFinished) && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-[#1B263B]/10 rounded-full">
                                      <svg className="w-3 h-3 text-[#1B263B]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-xs font-medium text-[#1B263B]">
                                        Terminé
                                      </span>
                                    </div>
                                  )}
                      {isActive && (
                        <div className="mt-3">
              <button
                            onClick={() => {
                              // Marquer le rendez-vous comme terminé et passer au suivant
                              alert(`Rendez-vous avec ${client.nom} terminé ! Passage au suivant.`);
                              // TODO: Implémenter la logique de mise à jour
                            }}
                            className="px-4 py-2 bg-[#F86F4D] hover:bg-[#F86F4D]/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Terminer et passer au suivant
              </button>
            </div>
                      )}
                                  
                                  {isCurrent && (
                                    <div className="mt-3">
                                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        Prochaine étape
                </div>
                                    </div>
                                  )}
                </div>
              </div>
            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Informations IA pour les suggestions */}
                  {selectedTournee.statut === 'suggestion' && (
                    <div className="bg-white border border-[#1B263B]/10 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-[#F86F4D]/10 rounded-lg">
                            <SparklesIcon className="h-6 w-6 text-[#F86F4D]" />
                    </div>
                  <div>
                            <h3 className="text-lg font-semibold text-[#1B263B]">Suggestion IA</h3>
                            <p className="text-sm text-[#1B263B]/70">Optimisation automatique</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F86F4D]/10 rounded-full">
                          <div className="w-2 h-2 bg-[#F86F4D] rounded-full"></div>
                          <span className="text-sm font-medium text-[#1B263B]">
                            {selectedTournee.score}% d'efficacité
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <ClockIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                              <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Temps gagné</p>
                              <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.economie}</p>
                    </div>
                  </div>
                </div>

                        <div className="p-3 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <MapPinIcon className="h-4 w-4 text-blue-600" />
                            </div>
                <div>
                              <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Distance</p>
                              <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.distance}</p>
                              </div>
                              </div>
                              </div>
                </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-[#1B263B]/10">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 bg-[#F86F4D]/10 rounded-lg mt-0.5">
                            <svg className="w-4 h-4 text-[#F86F4D]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                <div>
                            <h4 className="font-medium text-[#1B263B] mb-2">Optimisation intelligente</h4>
                            <p className="text-sm text-[#1B263B]/70 leading-relaxed mb-3">
                              Cette tournée a été générée par notre IA en analysant vos rendez-vous existants, 
                              les distances entre clients et votre historique de déplacements.
                            </p>
                            <div className="grid grid-cols-1 gap-1.5">
                              <div className="flex items-center gap-2 text-xs text-[#1B263B]/70">
                                <div className="w-1.5 h-1.5 bg-[#F86F4D] rounded-full"></div>
                                <span>Réduction des temps de trajet</span>
                </div>
                              <div className="flex items-center gap-2 text-xs text-[#1B263B]/70">
                                <div className="w-1.5 h-1.5 bg-[#F86F4D] rounded-full"></div>
                                <span>Optimisation de l'itinéraire</span>
              </div>
                              <div className="flex items-center gap-2 text-xs text-[#1B263B]/70">
                                <div className="w-1.5 h-1.5 bg-[#F86F4D] rounded-full"></div>
                                <span>Gain de productivité</span>
            </div>
                </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                {selectedTournee.statut === 'suggestion' && (
                  <>
              <button
                      onClick={() => {
                        handleAccepterSuggestion(selectedTournee.id);
                        closeModal();
                      }}
                      className="px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                    >
                      Accepter la suggestion
              </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      </AnimatePresence>

      {/* Modal de création de tournée */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCreateModal}
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
                    <PlusIcon className="w-5 h-5 text-[#F86F4D]" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">Nouvelle tournée</h2>
                    <p className="text-sm text-gray-600 truncate">Créer une nouvelle tournée pour vos rendez-vous</p>
                </div>
              </div>
              <button
                  onClick={closeCreateModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

              {/* Contenu */}
              <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                          <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la tournée
                    </label>
                  <input
                    type="text"
                      value={createFormData.nom}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, nom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                      placeholder="Ex: Tournée Paris Centre"
                  />
                </div>

                {/* Section mode de sélection */}
                      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mode de planification
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCreateFormData(prev => ({ ...prev, mode: 'existing' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        createFormData.mode === 'existing' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="font-medium">RDV existants</span>
                          </div>
                      <p className="text-xs mt-1 text-left">Basé sur vos rendez-vous acceptés</p>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCreateFormData(prev => ({ ...prev, mode: 'advance' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        createFormData.mode === 'advance' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                        <span className="font-medium">Planification</span>
                      </div>
                      <p className="text-xs mt-1 text-left">Planifier à l'avance</p>
                    </button>
                    </div>
                  </div>

                {/* Mode planification à l'avance */}
                {createFormData.mode === 'advance' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de la tournée
                    </label>
                    <input
                      type="date"
                      value={createFormData.date}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    />
                    <p className="text-xs text-gray-500 mt-1">Sélectionnez une date pour planifier votre tournée</p>
                              </div>
                )}

                {/* Section sélection des clients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {createFormData.mode === 'existing' 
                      ? `Sélectionner les rendez-vous (${createFormData.clients.length} sélectionné${createFormData.clients.length > 1 ? 's' : ''})`
                      : `Sélectionner les clients (${createFormData.clients.length} sélectionné${createFormData.clients.length > 1 ? 's' : ''})`
                    }
                  </label>
                  
                  {/* Liste des rendez-vous acceptés */}
                  <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {createFormData.mode === 'existing' ? (
                      // Mode RDV existants - groupés par date
                      (() => {
                        const rdvAcceptes = mockRendezVousAcceptes.filter(rdv => rdv.statut === 'accepte');
                        const rdvParDate = rdvAcceptes.reduce((acc, rdv) => {
                          if (!acc[rdv.date]) acc[rdv.date] = [];
                          acc[rdv.date].push(rdv);
                          return acc;
                        }, {} as Record<string, any[]>);
                        
                        return Object.entries(rdvParDate)
                          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                          .map(([date, rdvs]) => (
                            <div key={date} className="space-y-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <h4 className="font-medium text-gray-700">
                                  {new Date(date).toLocaleDateString('fr-FR', { 
                                    weekday: 'long', 
                                    day: 'numeric', 
                                    month: 'long' 
                                  })}
                                </h4>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {rdvs.length} RDV
                                </span>
                              </div>
                              <div className="space-y-2 pl-4">
                                {rdvs.map((rdv, index) => {
                                  const isSelected = createFormData.clients.some(c => c.nom === rdv.client);
                                  return (
                                    <div
                                      key={`${date}-${index}`}
                                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                        isSelected 
                                          ? 'bg-blue-50 border-blue-300 shadow-sm' 
                                          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                      }`}
                                      onClick={() => {
                                        if (isSelected) {
                                          setCreateFormData(prev => ({
                                            ...prev,
                                            clients: prev.clients.filter(c => c.nom !== rdv.client)
                                          }));
                                        } else {
                                          const newClient = {
                                            nom: rdv.client,
                                            adresse: rdv.adresse,
                                            heure: rdv.heure,
                                            type: rdv.type,
                                            motif: rdv.motif || rdv.type,
                                            equide: rdv.equide,
                                            date: rdv.date
                                          };
                                          setCreateFormData(prev => ({
                                            ...prev,
                                            clients: [...prev.clients, newClient]
                                          }));
                                        }
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                            isSelected 
                                              ? 'bg-blue-500 border-blue-500' 
                                              : 'border-gray-300'
                                          }`}>
                                            {isSelected && (
                                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                              <h4 className="font-medium text-gray-900">{rdv.client}</h4>
                                              <span className="text-sm text-gray-500">{rdv.heure}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{rdv.equide}</p>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                              </svg>
                                              {rdv.adresse}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{rdv.type}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                                  );
                                })}
                            </div>
                          </div>
                          ));
                      })()
                    ) : (
                      // Mode planification à l'avance - RDV d'aujourd'hui seulement
                      mockRendezVousAcceptes.filter(rdv => {
                        const today = new Date().toISOString().split('T')[0];
                        return rdv.date === today && rdv.statut === 'accepte';
                      }).map((rdv, index) => {
                        const isSelected = createFormData.clients.some(c => c.nom === rdv.client);
                        
                        return (
                          <div
                            key={index}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-[#F86F4D]/10 border-[#F86F4D] shadow-sm' 
                              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              // Désélectionner
                              setCreateFormData(prev => ({
                                ...prev,
                                clients: prev.clients.filter(c => c.nom !== rdv.client)
                              }));
                            } else {
                              // Sélectionner
                              const newClient = {
                                nom: rdv.client,
                                adresse: rdv.adresse,
                                heure: rdv.heure,
                                type: rdv.type,
                                motif: rdv.motif || rdv.type,
                                equide: rdv.equide,
                                date: rdv.date
                              };
                              setCreateFormData(prev => ({
                                ...prev,
                                clients: [...prev.clients, newClient]
                              }));
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-[#F86F4D] border-[#F86F4D]' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                            </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900">{rdv.client}</h4>
                                  <span className="text-sm text-gray-500">{rdv.heure}</span>
                          </div>
                                <p className="text-sm text-gray-600 mt-1">{rdv.equide}</p>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                  </svg>
                                  {rdv.adresse}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{rdv.type}</p>
                            </div>
                          </div>
                        </div>
                          </div>
                        );
                      })
                    )}
                    
                    {/* Message si aucun rendez-vous */}
                    {mockRendezVousAcceptes.filter(rdv => {
                      const today = new Date().toISOString().split('T')[0];
                      return rdv.date === today && rdv.statut === 'accepte';
                    }).length === 0 && (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Aucun rendez-vous accepté pour aujourd'hui</p>
                        <p className="text-xs text-gray-400 mt-1">Les rendez-vous acceptés apparaîtront ici</p>
                            </div>
                    )}
                          </div>
                          
                  {/* Clients sélectionnés */}
                  {createFormData.clients.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Clients sélectionnés</h4>
                        <div className="space-y-2">
                        {createFormData.clients.map((client, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[#F86F4D]/5 rounded-lg border border-[#F86F4D]/20">
                            <div>
                              <p className="font-medium text-gray-900">{client.nom}</p>
                              <p className="text-sm text-gray-600">{client.equide} • {client.heure}</p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                {client.adresse}
                                  </p>
                        </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCreateFormData(prev => ({
                                  ...prev,
                                  clients: prev.clients.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Retirer
                            </button>
                      </div>
                    ))}
                  </div>
                </div>
                  )}
                  
                  {/* Message informatif sur l'optimisation IA */}
                  {createFormData.clients.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <div>
                          <p className="text-xs font-medium text-blue-800">Optimisation automatique</p>
                          <p className="text-xs text-blue-700 mt-1">
                            L'IA calculera automatiquement l'ordre optimal de visite, les heures de rendez-vous et la durée totale pour minimiser les déplacements.
                                  </p>
                        </div>
                      </div>
                </div>
              )}
                            </div>
                  </div>
            </div>

                        {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeCreateModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                Annuler
                          </button>
                          <button
                onClick={handleSubmitTournee}
                  className="px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
              >
                Créer la tournée
              </button>
              </div>
            </motion.div>
          </div>
        </div>
        )}
      </AnimatePresence>
    </div>
  );
