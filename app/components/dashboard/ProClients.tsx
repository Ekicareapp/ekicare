"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

// Types
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  dateInscription: string;
  nombreEquides: number;
  dernierRendezVous: string;
  totalRendezVous: number;
  statut: "actif" | "inactif";
  notes: string;
}

// Clients par défaut
const clientsDefaut: Client[] = [];

export default function ProClients() {
  const [clients, setClients] = useState<Client[]>(clientsDefaut);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState<"tous" | "actif" | "inactif">("tous");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVoirDetails = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleFermerModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleExportCSV = () => {
    const csvContent = [
      // En-têtes
      [
        "Nom",
        "Prénom", 
        "Email",
        "Téléphone",
        "Adresse",
        "Ville",
        "Code Postal",
        "Date d'inscription",
        "Nombre d'équidés",
        "Dernier rendez-vous",
        "Total rendez-vous",
        "Statut",
        "Notes"
      ],
      // Données
      ...clientsFiltres.map(client => [
        client.nom,
        client.prenom,
        client.email,
        client.telephone,
        client.adresse,
        client.ville,
        client.codePostal,
        new Date(client.dateInscription).toLocaleDateString('fr-FR'),
        client.nombreEquides.toString(),
        new Date(client.dernierRendezVous).toLocaleDateString('fr-FR'),
        client.totalRendezVous.toString(),
        client.statut === "actif" ? "Actif" : "Inactif",
        client.notes || ""
      ])
    ].map(row => 
      row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clientsFiltres = clients.filter(client => {
    const matchesSearch = 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = filterStatut === "tous" || client.statut === filterStatut;
    
    return matchesSearch && matchesStatut;
  });

  const clientsActifs = clients.filter(client => client.statut === "actif").length;
  const clientsInactifs = clients.filter(client => client.statut === "inactif").length;

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
          Mes clients
        </h1>
        <p className="text-[#1B263B]/70">
          Gérez votre base de clients et leurs informations.
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Total clients</p>
              <p className="text-2xl font-bold text-[#1B263B]">{clients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Clients actifs</p>
              <p className="text-2xl font-bold text-[#1B263B]">{clientsActifs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Clients inactifs</p>
              <p className="text-2xl font-bold text-[#1B263B]">{clientsInactifs}</p>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-lg border border-[#1B263B]/10"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value as "tous" | "actif" | "inactif")}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-center"
                style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="tous">Tous les clients</option>
                <option value="actif">Clients actifs</option>
                <option value="inactif">Clients inactifs</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-3 py-2 text-[#1B263B] bg-white border border-[#1B263B]/20 rounded-lg transition-colors hover:bg-[#1B263B]/5 text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Exporter CSV</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-3 py-2 text-white rounded-lg transition-colors text-sm"
              style={{backgroundColor: '#f76f4d'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a3a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f76f4d'}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Nouveau client</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Liste des clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg border border-[#1B263B]/10"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1B263B]">
            Liste des clients ({clientsFiltres.length})
          </h2>
        </div>

        {clientsFiltres.length === 0 ? (
          <div className="p-8 text-center">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun client trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {clientsFiltres.map((client) => (
              <div key={client.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {client.prenom[0]}{client.nom[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-[#1B263B]">
                          {client.prenom} {client.nom}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.statut === "actif" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {client.statut === "actif" ? "Actif" : "Inactif"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{client.telephone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Email:</span>
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{client.adresse}, {client.codePostal} {client.ville}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Inscrit le {new Date(client.dateInscription).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Équidés:</span>
                          <span className="ml-1 font-medium text-[#1B263B]">{client.nombreEquides}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">RDV total:</span>
                          <span className="ml-1 font-medium text-[#1B263B]">{client.totalRendezVous}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dernier RDV:</span>
                          <span className="ml-1 font-medium text-[#1B263B]">
                            {new Date(client.dernierRendezVous).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVoirDetails(client)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Voir les détails"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal de détails */}
      <AnimatePresence>
        {isModalOpen && selectedClient && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleFermerModal}
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
                    Détails du client
                  </h2>
                  <button
                    onClick={handleFermerModal}
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
                {/* Informations personnelles */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1B263B] mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-[#1B263B] font-medium">
                        {selectedClient.prenom} {selectedClient.nom}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-[#1B263B]">{selectedClient.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="text-[#1B263B]">{selectedClient.telephone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Statut</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedClient.statut === "actif" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {selectedClient.statut === "actif" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1B263B] mb-4">Adresse</h3>
                  <p className="text-[#1B263B]">
                    {selectedClient.adresse}<br />
                    {selectedClient.codePostal} {selectedClient.ville}
                  </p>
                </div>

                {/* Statistiques */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1B263B] mb-4">Statistiques</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-[#1B263B]">{selectedClient.nombreEquides}</p>
                      <p className="text-sm text-gray-600">Équidés</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-[#1B263B]">{selectedClient.totalRendezVous}</p>
                      <p className="text-sm text-gray-600">RDV total</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-[#1B263B]">
                        {new Date(selectedClient.dateInscription).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">Inscrit</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedClient.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#1B263B] mb-4">Notes</h3>
                    <p className="text-[#1B263B] bg-gray-50 p-4 rounded-lg">
                      {selectedClient.notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
