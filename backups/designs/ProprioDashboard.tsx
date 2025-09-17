"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Demande } from "@/lib/types";

// Données des demandes (vide - sera rempli par l'API)
const mockDemandes: Demande[] = [];

// Données des rendez-vous (vide - sera rempli par l'API)
const mockRendezVous: Demande[] = [];

// Données des équidés (vide - sera rempli par l'API)
const mockChevaux: any[] = [];

export default function ProprioDashboard() {
  const [demandes, setDemandes] = useState(mockDemandes);
  const [rendezVous, setRendezVous] = useState(mockRendezVous);

  const handleCancelDemande = (id: string) => {
    setDemandes(prev => prev.filter(d => d.id !== id));
  };

  const demandesEnCours = demandes.filter(d => d.statut === "pending");
  const rendezVousAcceptes = rendezVous.filter(d => d.statut === "accepted");
  const demandesAcceptees = demandes.filter(d => d.statut === "accepted");
  const demandesRefusees = demandes.filter(d => d.statut === "rejected" as any);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-[#1B263B] mb-2">
          Tableau de bord Propriétaire
        </h1>
        <p className="text-[#1B263B]/70">
          Gérez vos équidés, vos demandes de soins et vos rendez-vous.
        </p>
      </motion.div>

      {/* Statistiques colorées */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Demandes en cours</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{demandesEnCours.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Demandes acceptées</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{demandesAcceptees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Rendez-vous</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{rendezVousAcceptes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Mes équidés</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{mockChevaux.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grille des sections */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        
        {/* Demandes en cours */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#1B263B] mb-1 sm:mb-2">
              Demandes en cours ({demandesEnCours.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#1B263B]/70">
              Vos demandes de soins en attente de réponse
            </p>
          </div>
          {demandesEnCours.length > 0 ? (
            <div className="space-y-3">
              {demandesEnCours.map((demande, index) => (
                <motion.div 
                  key={demande.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-3 sm:p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-medium text-[#1B263B] text-sm sm:text-base">
                      {demande.pro.nom} ({demande.pro.metier})
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        En attente
                      </span>
                      <button
                        onClick={() => handleCancelDemande(demande.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-[#1B263B]/70 space-y-1">
                    <p>Cheval : {demande.cheval?.nom}</p>
                    <p className="hidden sm:block">Date : {new Date(demande.start_at).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p className="sm:hidden">Date : {new Date(demande.start_at).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}</p>
                    <p>Heure : {new Date(demande.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>Ville : {demande.pro.ville}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#1B263B] mb-2">Aucune demande en cours</h3>
              <p className="text-[#1B263B]/70">Vous n'avez pas de demandes de soins en attente.</p>
            </div>
          )}
        </motion.div>

        {/* Rendez-vous à venir */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#1B263B] mb-1 sm:mb-2">
              Rendez-vous à venir ({rendezVousAcceptes.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#1B263B]/70">
              Vos prochains rendez-vous confirmés
            </p>
          </div>
          {rendezVousAcceptes.length > 0 ? (
            <div className="space-y-3">
              {rendezVousAcceptes.map((rdv, index) => (
                <motion.div 
                  key={rdv.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-3 sm:p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-medium text-[#1B263B] text-sm sm:text-base">
                      {rdv.pro.nom} ({rdv.pro.metier})
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 self-start">
                      {new Date(rdv.start_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#1B263B]/70 space-y-1">
                    <p>Cheval : {rdv.cheval?.nom}</p>
                    <p>Heure : {new Date(rdv.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>Ville : {rdv.pro.ville}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#1B263B] mb-1">Aucun rendez-vous</h3>
              <p className="text-sm text-[#1B263B]/70">Vous n'avez pas de rendez-vous à venir.</p>
            </div>
          )}
        </motion.div>

        {/* Mes chevaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#1B263B] mb-1 sm:mb-2">
              Mes chevaux ({mockChevaux.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#1B263B]/70">
              Vos équidés enregistrés
            </p>
          </div>
          <div className="space-y-3">
            {mockChevaux.length === 0 ? (
              <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
                <div className="mx-auto h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-[#1B263B] mb-1">Aucun équidé</h3>
                <p className="text-sm text-[#1B263B]/70">Vous n'avez pas encore enregistré d'équidé.</p>
              </div>
            ) : (
              mockChevaux.map((cheval, index) => (
                <motion.div 
                  key={cheval.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-3 sm:p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-medium text-[#1B263B] text-sm sm:text-base">{cheval.nom}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 self-start">
                      {cheval.age} ans
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#1B263B]/70 space-y-1">
                    <p>Race : {cheval.race}</p>
                    <p>Couleur : {cheval.couleur}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
