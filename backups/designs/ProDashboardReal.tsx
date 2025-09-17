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
import VueMensuelleCompacte from "./VueMensuelleCompacte";

// Mock data pour le professionnel
const mockProProfile = {
  nom: "Dr. Marie",
  prenom: "Dubois",
  specialite: "Vétérinaire équine",
  experience: "10 ans",
  note: 4.8,
  clientsActifs: 45
};

const mockStats = {
  rendezVousAujourdhui: 4,
  rendezVousCetteSemaine: 18,
  clientsActifs: 45,
  revenusMois: 2800,
  satisfaction: 4.8
};

const mockRendezVous = [
  {
    id: "1",
    client: "Marie Dubois",
    equide: "Thunder",
    heure: "14:30",
    type: "Vaccination",
    statut: "confirmé"
  },
  {
    id: "2",
    client: "Pierre Martin", 
    equide: "Bella",
    heure: "16:00",
    type: "Consultation",
    statut: "en_attente"
  },
  {
    id: "3",
    client: "Sophie Laurent",
    equide: "Spirit",
    heure: "09:30",
    type: "Vermifugation",
    statut: "confirmé"
  }
];

export default function ProDashboardReal() {
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Aujourd'hui</p>
              <p className="text-2xl font-bold text-[#1B263B]">{mockStats.rendezVousAujourdhui}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Cette semaine</p>
              <p className="text-2xl font-bold text-[#1B263B]">{mockStats.rendezVousCetteSemaine}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Clients actifs</p>
              <p className="text-2xl font-bold text-[#1B263B]">{mockStats.clientsActifs}</p>
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
        {/* Rendez-vous du jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-2">
              Rendez-vous d'aujourd'hui ({mockRendezVous.length})
            </h2>
            <p className="text-sm text-[#1B263B]/70">
              Vos rendez-vous confirmés pour aujourd'hui
            </p>
          </div>
          {mockRendezVous.length > 0 ? (
            <div className="space-y-3">
              {mockRendezVous.map((rdv, index) => (
                <motion.div 
                  key={rdv.id} 
                  className="rounded-lg border border-[#1B263B]/10 bg-white p-3 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-medium text-[#1B263B] text-sm sm:text-base">
                      {rdv.client} - {rdv.equide}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 self-start sm:self-auto">
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

        {/* Vue mensuelle des rendez-vous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <VueMensuelleCompacte />
        </motion.div>
      </motion.div>

    </div>
  );
}
