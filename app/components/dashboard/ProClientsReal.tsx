"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useClients } from "@/hooks/useApiData";
import ExportButton from "../ui/ExportButton";
import AdvancedSearch from "../ui/AdvancedSearch";

interface Client {
  id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  dateInscription: string;
  nombreEquides: number;
  dernierRendezVous?: string;
  totalRendezVous: number;
  statut: string;
  notes?: string;
}

export default function ProClientsReal() {
  const { clients: apiClients, loading: apiLoading, createClient, updateClient } = useClients();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState<"tous" | "actif" | "inactif">("tous");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Transformer les données API en format Client
  useEffect(() => {
    if (apiClients) {
      const transformedClients: Client[] = apiClients.map(client => ({
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email || '',
        telephone: client.telephone,
        adresse: client.adresse || '',
        ville: client.ville || '',
        codePostal: '',
        dateInscription: client.createdAt,
        nombreEquides: 0, // À calculer
        totalRendezVous: 0, // À calculer
        statut: 'actif',
        notes: client.notes || ''
      }));
      setClients(transformedClients);
    }
  }, [apiClients]);

  const handleExportCSV = () => {
    const filteredClients = getFilteredClients();
    const csvContent = [
      ['Nom', 'Prénom', 'Email', 'Téléphone', 'Ville', 'Statut', 'Date inscription'],
      ...filteredClients.map(client => [
        client.nom,
        client.prenom,
        client.email,
        client.telephone,
        client.ville,
        client.statut,
        new Date(client.dateInscription).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clients.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredClients = () => {
    return clients.filter(client => {
      const matchesSearch = 
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatut = filterStatut === "tous" || client.statut === filterStatut;
      
      return matchesSearch && matchesStatut;
    });
  };

  if (apiLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStats = () => {
    const total = clients.length;
    const actifs = clients.filter(c => c.statut === 'actif').length;
    const inactifs = total - actifs;
    
    return { total, actifs, inactifs };
  };

  const stats = getStats();
  const filteredClients = getFilteredClients();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6F2] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-[#F86F4D] flex items-center justify-center mb-4">
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-[#1B263B]/70">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B]">Mes clients</h1>
            <p className="text-sm sm:text-base text-[#1B263B]/70 mt-1">
              Gérez votre base de clients
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton 
              data={{ clients: clients }} 
              filename="mes-clients"
              className="px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-[#F86F4D]/10">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#F86F4D]" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Total clients</p>
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
            <div className="p-2 sm:p-3 rounded-lg bg-green-100">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Clients actifs</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1B263B]">{stats.actifs}</p>
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
            <div className="p-2 sm:p-3 rounded-lg bg-gray-100">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Clients inactifs</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1B263B]">{stats.inactifs}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
        <div className="space-y-4">
          {/* Recherche simple */}
          <div className="w-full">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#1B263B]/50" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          {/* Recherche avancée */}
          <AdvancedSearch
            onSearch={(filters) => {
              console.log('Recherche avancée:', filters);
              // Ici on pourrait implémenter la logique de recherche avancée
            }}
            onClear={() => {
              console.log('Effacer recherche avancée');
            }}
            fields={[
              { key: 'nom', label: 'Nom', type: 'text' },
              { key: 'prenom', label: 'Prénom', type: 'text' },
              { key: 'ville', label: 'Ville', type: 'text' },
              { key: 'statut', label: 'Statut', type: 'select', options: [
                { value: 'actif', label: 'Actif' },
                { value: 'inactif', label: 'Inactif' }
              ]},
              { key: 'dateInscription', label: 'Date d\'inscription', type: 'date' }
            ]}
            className="w-full"
          />

          {/* Filtres et boutons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value as "tous" | "actif" | "inactif")}
              className="flex-1 sm:flex-none px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="tous">Tous les clients</option>
              <option value="actif">Clients actifs</option>
              <option value="inactif">Clients inactifs</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center space-x-2 px-3 py-2 sm:py-3 text-[#1B263B] bg-white border border-[#1B263B]/20 rounded-lg transition-colors hover:bg-[#1B263B]/5 text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="space-y-3 sm:space-y-4">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#1B263B]/10 p-6 sm:p-8 text-center">
            <UserGroupIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#1B263B]/30" />
            <p className="mt-2 text-sm sm:text-base text-[#1B263B]/70">Aucun client trouvé</p>
          </div>
        ) : (
          filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6"
            >
              <div className="space-y-3 sm:space-y-4">
                {/* En-tête avec nom et statut */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-[#F86F4D]/10 flex-shrink-0">
                        <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#F86F4D]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[#1B263B] text-sm sm:text-base truncate">
                          {client.prenom} {client.nom}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#1B263B]/70 truncate">{client.email}</p>
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      client.statut === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="p-1.5 sm:p-2 text-[#1B263B]/70 hover:text-[#F86F4D] transition-colors flex-shrink-0"
                  >
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {/* Informations principales */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-start space-x-2">
                      <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/50 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#1B263B]/70 break-words">{client.telephone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/50 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#1B263B]/70 break-words">
                        {client.adresse}, {client.ville} {client.codePostal}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-start space-x-2">
                      <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/50 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#1B263B]/70">
                        Inscrit le {new Date(client.dateInscription).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#1B263B]/50 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#1B263B]/70">
                        {client.nombreEquides} équidé(s) • {client.totalRendezVous} RDV
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Détails Client */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedClient(null)}
            />
            
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl max-w-full sm:max-w-2xl w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#1B263B] truncate">
                  {selectedClient.prenom} {selectedClient.nom}
                </h2>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-1.5 sm:p-2 text-[#1B263B]/70 hover:text-[#1B263B] transition-colors flex-shrink-0"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-semibold text-[#1B263B] mb-3 text-sm sm:text-base">Informations de contact</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Email</p>
                      <p className="text-sm sm:text-base text-[#1B263B] break-words">{selectedClient.email}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Téléphone</p>
                      <p className="text-sm sm:text-base text-[#1B263B]">{selectedClient.telephone}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Adresse</p>
                      <p className="text-sm sm:text-base text-[#1B263B] break-words">
                        {selectedClient.adresse}, {selectedClient.ville} {selectedClient.codePostal}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B263B] mb-3 text-sm sm:text-base">Statistiques</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Statut</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        selectedClient.statut === 'actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedClient.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Date d'inscription</p>
                      <p className="text-sm sm:text-base text-[#1B263B]">
                        {new Date(selectedClient.dateInscription).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Nombre d'équidés</p>
                      <p className="text-sm sm:text-base text-[#1B263B]">{selectedClient.nombreEquides}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Total rendez-vous</p>
                      <p className="text-sm sm:text-base text-[#1B263B]">{selectedClient.totalRendezVous}</p>
                    </div>
                    {selectedClient.dernierRendezVous && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-1">Dernier rendez-vous</p>
                        <p className="text-sm sm:text-base text-[#1B263B]">
                          {new Date(selectedClient.dernierRendezVous).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedClient.notes && (
                  <div>
                    <h3 className="font-semibold text-[#1B263B] mb-3 text-sm sm:text-base">Notes</h3>
                    <p className="text-sm sm:text-base text-[#1B263B]/70 bg-gray-50 rounded-lg p-3">
                      {selectedClient.notes}
                    </p>
                  </div>
                )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
