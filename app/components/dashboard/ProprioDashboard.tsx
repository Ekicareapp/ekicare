"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDemandes, useRendezVous } from "@/hooks/useApiData";
import { useSession } from "next-auth/react";

export default function ProprioDashboard() {
  const { data: session } = useSession();
  const { demandes, loading: demandesLoading, updateDemande } = useDemandes();
  const { rendezVous, loading: rendezVousLoading } = useRendezVous();
  const [chevaux, setChevaux] = useState<any[]>([]);
  const [chevauxLoading, setChevauxLoading] = useState(true);
  const [localDemandes, setLocalDemandes] = useState<any[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [demandeToCancel, setDemandeToCancel] = useState<any>(null);

  // Charger les équidés
  const loadChevaux = async () => {
    if (!session?.user?.id) {
      setChevauxLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/equides?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setChevaux(data.equides || []);
      }
    } catch (error) {
      console.error("Erreur chargement équidés:", error);
    } finally {
      setChevauxLoading(false);
    }
  };

  useEffect(() => {
    loadChevaux();
  }, [session]);

  // Rafraîchir les équidés toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(loadChevaux, 5000);
    return () => clearInterval(interval);
  }, [session]);

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

  const handleCancelDemande = (demande: any) => {
    setDemandeToCancel(demande);
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    if (!demandeToCancel) return;
    
    try {
      await updateDemande(demandeToCancel.id, 'rejected');
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

  // Combiner les demandes de l'API et du localStorage en évitant les doublons
  const allDemandes = [...demandes];
  
  // Ajouter les demandes du localStorage seulement si elles ne sont pas déjà dans l'API
  localDemandes.forEach(localDemande => {
    const existsInApi = demandes.some(apiDemande => apiDemande.id === localDemande.id);
    if (!existsInApi) {
      allDemandes.push(localDemande);
    }
  });
  
  const demandesEnCours = allDemandes.filter(d => d.statut === "pending" || d.statut === "EN_ATTENTE");
  const rendezVousAcceptes = rendezVous.filter(d => d.statut === "confirmé");
  const demandesAcceptees = allDemandes.filter(d => d.statut === "accepted" || d.statut === "ACCEPTEE");
  const demandesRefusees = allDemandes.filter(d => d.statut === "rejected" || d.statut === "REFUSEE");

  // Équidés - maintenant chargés depuis l'API

  if (demandesLoading || rendezVousLoading || chevauxLoading) {
    return (
      <div className="space-y-6">
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
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{chevaux.length}</p>
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
                      {demande.pro ? `${demande.pro.nom} (${demande.pro.profession || demande.pro.metier || 'Professionnel'})` : 'Professionnel non assigné'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        En attente
                      </span>
                      <button
                        onClick={() => handleCancelDemande(demande)}
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-[#1B263B]/70 space-y-1">
                    <p>Cheval : {demande.cheval?.nom || 'Équidé inconnu'}</p>
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
                    <p>Ville : {demande.pro?.ville || 'Non spécifiée'}</p>
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
                      {rdv.client ? `${rdv.client.nom} ${rdv.client.prenom}` : 'Client inconnu'}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 self-start">
                      {new Date(rdv.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#1B263B]/70 space-y-1">
                    <p>Cheval : {rdv.equide?.nom || 'Équidé inconnu'}</p>
                    <p>Heure : {rdv.heure || 'Heure non définie'}</p>
                    <p>Type : {rdv.notes || 'Consultation'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Mes chevaux ({chevaux.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#1B263B]/70">
              Vos équidés enregistrés
            </p>
          </div>
          <div className="space-y-3">
            {chevaux.length === 0 ? (
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
              chevaux.map((cheval, index) => (
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
                    <p>Sexe : {cheval.sexe}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Modal de confirmation d'annulation */}
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
      </motion.div>
    </div>
  );
}
