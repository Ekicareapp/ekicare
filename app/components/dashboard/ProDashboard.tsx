"use client";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

// Profil du professionnel par défaut
const proProfileDefaut = {
  nom: "",
  profession: "",
  localisation: "",
  experience: "",
  photo: "",
  rating: 0,
  clients: 0
};

const statsDefaut = {
  rendezVousAujourdhui: 0,
  rendezVousCetteSemaine: 0,
  clientsActifs: 0
};

// Données des rendez-vous (vide - sera rempli par l'API)
const rendezVousDefaut = [];
export default function ProDashboard() {
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
          Tableau de bord Pro
        </h1>
        <p className="text-[#1B263B]/70">
          Gérez vos rendez-vous, vos clients et votre planning.
        </p>
      </motion.div>

      {/* Statistiques colorées */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Aujourd'hui</p>
              <p className="text-2xl font-bold text-[#1B263B]">{statsDefaut.rendezVousAujourdhui}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Cette semaine</p>
              <p className="text-2xl font-bold text-[#1B263B]">{statsDefaut.rendezVousCetteSemaine}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Clients actifs</p>
              <p className="text-2xl font-bold text-[#1B263B]">{statsDefaut.clientsActifs}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grille des sections */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Rendez-vous du jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-2">
              Rendez-vous d'aujourd'hui ({rendezVousDefaut.length})
            </h2>
            <p className="text-sm text-[#1B263B]/70">
              Vos rendez-vous confirmés pour aujourd'hui
            </p>
          </div>
          {rendezVousDefaut.length > 0 ? (
            <div className="space-y-3">
              {rendezVousDefaut.map((rdv, index) => (
                <motion.div 
                  key={rdv.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#1B263B]">
                      {rdv.client} - {rdv.equide}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {rdv.heure}
                    </span>
                  </div>
                  <div className="text-sm text-[#1B263B]/70 space-y-1">
                    <p>Type : {rdv.type}</p>
                    <p>Statut : {rdv.statut}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-medium text-[#1B263B] mb-1">Aucun rendez-vous</h3>
              <p className="text-sm text-[#1B263B]/70">Vous n'avez pas de rendez-vous aujourd'hui.</p>
            </div>
          )}
        </motion.div>

        {/* Rendez-vous en attente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-2">
              Rendez-vous en attente ({rendezVousDefaut.filter(rdv => rdv.statut === "en_attente").length})
            </h2>
            <p className="text-sm text-[#1B263B]/70">
              Demandes en attente de votre confirmation
            </p>
          </div>
          {rendezVousDefaut.filter(rdv => rdv.statut === "en_attente").length === 0 ? (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                <CheckIcon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-medium text-[#1B263B] mb-1">Aucune demande en attente</h3>
              <p className="text-sm text-[#1B263B]/70">Toutes vos demandes sont traitées.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rendezVousDefaut.filter(rdv => rdv.statut === "en_attente").map((rdv, index) => (
                <motion.div 
                  key={rdv.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#1B263B]">
                      {rdv.client} - {rdv.equide}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      En attente
                    </span>
                  </div>
                  <div className="text-sm text-[#1B263B]/70 space-y-1 mb-3">
                    <p>Type : {rdv.type}</p>
                    <p>Heure : {rdv.heure}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-white text-sm rounded-md transition-colors" style={{backgroundColor: '#f76f4d'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a3a'} onMouseLeave={(e) => e.target.style.backgroundColor = '#f76f4d'}>
                      <CheckIcon className="h-4 w-4 inline mr-1" />
                      Accepter
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors">
                      <XMarkIcon className="h-4 w-4 inline mr-1" />
                      Refuser
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

    </div>
  );
}
