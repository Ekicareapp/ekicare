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
    id: "tournee-1",
    nom: "Tournée Paris Nord",
    date: "2025-01-15",
    heureDebut: "09:00",
    heureFin: "12:00",
    statut: "planifie",
    clients: [
      {
        nom: "Marie Dubois",
        adresse: "123 Rue des Écuries, 75012 Paris",
        heure: "09:30",
        type: "Vaccination",
        motif: "Vaccination annuelle",
        equide: "Thunder (8 ans)"
      }
    ],
    distance: "15 km",
    duree: "3h"
  }
];

export default function ProTourneesReal() {
  const [filterStatut, setFilterStatut] = useState("suggestions");
  const [tournees, setTournees] = useState(mockTournees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournee, setSelectedTournee] = useState<any>(null);

  // Fonctions de base
  const handleVoirDetails = (tournee: any) => {
    setSelectedTournee(tournee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTournee(null);
  };

  const getStats = () => ({
    totalTournees: tournees.length,
    tourneesEnCours: tournees.filter(t => t.statut === 'en_cours').length,
    tourneesTerminees: tournees.filter(t => t.statut === 'termine').length
  });

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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F86F4D]/10 rounded-lg">
              <MapIcon className="w-5 h-5 text-[#F86F4D]" />
            </div>
            <div>
              <p className="text-sm text-[#1B263B]/70">Total</p>
              <p className="text-xl font-bold text-[#1B263B]">{stats.totalTournees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlayIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[#1B263B]/70">En cours</p>
              <p className="text-xl font-bold text-[#1B263B]">{stats.tourneesEnCours}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[#1B263B]/70">Terminées</p>
              <p className="text-xl font-bold text-[#1B263B]">{stats.tourneesTerminees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {['suggestions', 'planifie', 'en_cours', 'termine', 'ignore'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatut(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatut === tab
                  ? 'bg-[#F86F4D] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab === 'suggestions' ? 'Suggestions' : 
               tab === 'planifie' ? 'Planifiés' :
               tab === 'en_cours' ? 'En cours' :
               tab === 'termine' ? 'Terminé' : 'Ignoré'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {tournees.filter(tournee => tournee.statut === filterStatut).map((tournee) => (
            <div key={tournee.id} className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-[#1B263B]">{tournee.nom}</h3>
                  <p className="text-sm text-[#1B263B]/70 mt-1">
                    {new Date(tournee.date).toLocaleDateString('fr-FR')} • {tournee.heureDebut} - {tournee.heureFin}
                  </p>
                  <p className="text-sm text-[#1B263B]/70">
                    {tournee.clients.length} client{tournee.clients.length > 1 ? 's' : ''} • {tournee.distance} • {tournee.duree}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVoirDetails(tournee)}
                    className="p-2 text-gray-600 hover:text-[#F86F4D] transition-colors"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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



