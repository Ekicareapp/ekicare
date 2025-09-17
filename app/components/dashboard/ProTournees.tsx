"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClockIcon,
  MapPinIcon,
  TruckIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  LightBulbIcon,
  SparklesIcon,
  MapIcon,
  UserGroupIcon,
  TagIcon,
  PencilIcon
} from "@heroicons/react/24/outline";

// Types
interface RendezVous {
  id: number;
  client: string;
  equide: string;
  adresse: string;
  ville: string;
  codePostal: string;
  date: string;
  heure: string;
  duree: number;
  type: string;
  statut: "en_attente" | "confirmé" | "annulé" | "terminé";
  coordonnees?: { lat: number; lng: number };
}

interface SuggestionTournee {
  id: string;
  nom: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  rendezVous: RendezVous[];
  distanceTotale: number;
  dureeTotale: number;
  economieTemps: number; // en minutes par rapport à des RDV séparés
  score: number; // score d'optimisation (0-100)
  zone: string;
  statut: "suggestion" | "acceptee" | "rejetee";
}

interface TourneeAcceptee extends Omit<SuggestionTournee, 'statut'> {
  statut: "acceptee" | "en_cours" | "terminee" | "annulee";
  notes?: string;
}

// Rendez-vous du professionnel - sera récupéré via l'API
const today = new Date().toISOString().split('T')[0];
const rendezVousDefaut: RendezVous[] = [];

// Algorithme de groupement géographique et optimisation
function genererSuggestionsTournees(rendezVous: RendezVous[]): SuggestionTournee[] {
  const suggestions: SuggestionTournee[] = [];
  
  // Grouper les RDV par date
  const rdvParDate = rendezVous.reduce((acc, rdv) => {
    if (!acc[rdv.date]) acc[rdv.date] = [];
    acc[rdv.date].push(rdv);
    return acc;
  }, {} as Record<string, RendezVous[]>);

  Object.entries(rdvParDate).forEach(([date, rdvList]) => {
    if (rdvList.length < 2) return; // Pas de tournée pour un seul RDV
    
    // Algorithme de groupement par proximité (simplifié)
    const groupes = [];
    const rdvRestants = [...rdvList];
    
    while (rdvRestants.length > 0) {
      const groupe = [rdvRestants.shift()!];
      const centreLat = groupe[0].coordonnees?.lat || 0;
      const centreLng = groupe[0].coordonnees?.lng || 0;
      
      // Trouver les RDV proches (dans un rayon de 10km)
      for (let i = rdvRestants.length - 1; i >= 0; i--) {
        const rdv = rdvRestants[i];
        if (!rdv.coordonnees) continue;
        
        const distance = calculerDistance(
          centreLat, centreLng,
          rdv.coordonnees.lat, rdv.coordonnees.lng
        );
        
        if (distance <= 10) { // 10km
          groupe.push(rdv);
          rdvRestants.splice(i, 1);
        }
      }
      
      if (groupe.length >= 2) {
        groupes.push(groupe);
      }
    }
    
    // Créer les suggestions pour chaque groupe
    groupes.forEach((groupe, index) => {
      const suggestion = creerSuggestionTournee(groupe, date, index + 1);
      suggestions.push(suggestion);
    });
  });
  
  return suggestions;
}

// Fonction de calcul de distance (formule de Haversine)
function calculerDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Créer une suggestion de tournée
function creerSuggestionTournee(groupe: RendezVous[], date: string, numero: number): SuggestionTournee {
  // Trier par heure
  groupe.sort((a, b) => a.heure.localeCompare(b.heure));
  
  // Calculer la distance totale (simplifié)
  let distanceTotale = 0;
  for (let i = 0; i < groupe.length - 1; i++) {
    const rdv1 = groupe[i];
    const rdv2 = groupe[i + 1];
    if (rdv1.coordonnees && rdv2.coordonnees) {
      distanceTotale += calculerDistance(
        rdv1.coordonnees.lat, rdv1.coordonnees.lng,
        rdv2.coordonnees.lat, rdv2.coordonnees.lng
      );
    }
  }
  
  // Calculer l'économie de temps (temps de trajet économisé)
  const tempsTrajetSepare = groupe.length * 30; // 30min de trajet moyen par RDV
  const tempsTrajetOptimise = distanceTotale * 2; // 2min par km
  const economieTemps = Math.max(0, tempsTrajetSepare - tempsTrajetOptimise);
  
  // Calculer le score d'optimisation
  const score = Math.min(100, Math.round(
    (economieTemps / 60) * 20 + // Bonus pour l'économie de temps
    (groupe.length - 1) * 15 + // Bonus pour le nombre de RDV
    Math.max(0, 50 - distanceTotale) // Bonus pour la distance réduite
  ));
  
  // Calculer la durée totale
  const dureeTotale = groupe.reduce((sum, rdv) => sum + rdv.duree, 0) + distanceTotale * 2;
  
  return {
    id: `tournee-${date}-${numero}`,
    nom: `Tournée ${numero}`,
    date,
    heureDebut: groupe[0].heure,
    heureFin: calculerHeureFin(groupe[groupe.length - 1].heure, groupe[groupe.length - 1].duree),
    rendezVous: groupe,
    distanceTotale: Math.round(distanceTotale * 10) / 10,
    dureeTotale: Math.round(dureeTotale),
    economieTemps: Math.round(economieTemps),
    score,
    zone: groupe[0].ville,
    statut: "suggestion"
  };
}

// Calculer l'heure de fin
function calculerHeureFin(heure: string, duree: number): string {
  const [h, m] = heure.split(':').map(Number);
  const totalMinutes = h * 60 + m + duree;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

export default function ProTournees() {
  const [suggestions, setSuggestions] = useState<SuggestionTournee[]>([]);
  const [tourneesAcceptees, setTourneesAcceptees] = useState<TourneeAcceptee[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<"suggestions" | "tournees">("suggestions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournee, setSelectedTournee] = useState<SuggestionTournee | TourneeAcceptee | null>(null);

  // Générer les suggestions au chargement
  useEffect(() => {
    const nouvellesSuggestions = genererSuggestionsTournees(rendezVousDefaut);
    setSuggestions(nouvellesSuggestions);
  }, []);

  const handleAccepter = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const tourneeAcceptee: TourneeAcceptee = {
        ...suggestion,
        statut: "acceptee",
        notes: ""
      };
      setTourneesAcceptees(prev => [...prev, tourneeAcceptee]);
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    }
  };

  const handleRejeter = (suggestionId: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId ? { ...s, statut: "rejetee" } : s
    ));
  };

  const handleVoirDetails = (tournee: SuggestionTournee | TourneeAcceptee) => {
    setSelectedTournee(tournee);
    setIsModalOpen(true);
  };

  const handleFermerModal = () => {
    setIsModalOpen(false);
    setSelectedTournee(null);
  };

  const suggestionsDuJour = suggestions.filter(s => s.date === selectedDate);
  const tourneesDuJour = tourneesAcceptees.filter(t => t.date === selectedDate);

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
          Mes tournées
        </h1>
        <p className="text-[#1B263B]/70">
          Suggestions intelligentes de tournées basées sur vos rendez-vous.
        </p>
        
        {/* Information sur l'approche */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Suggestions uniquement</p>
              <p className="text-sm text-blue-600 mt-1">
                Les tournées sont générées automatiquement. Vous pouvez accepter, rejeter ou modifier les suggestions.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtres et onglets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white p-4 sm:p-6 rounded-lg border border-[#1B263B]/10"
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === "suggestions"
                  ? "bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={activeTab === "suggestions" ? {color: '#f76f4d'} : {}}
            >
              <span className="hidden sm:inline">Suggestions</span>
              <span className="sm:hidden">Sugg.</span>
            </button>
            <button
              onClick={() => setActiveTab("tournees")}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === "tournees"
                  ? "bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={activeTab === "tournees" ? {color: '#f76f4d'} : {}}
            >
              <span className="hidden sm:inline">Mes tournées</span>
              <span className="sm:hidden">Tournées</span>
            </button>
          </div>
        </div>
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
              <LightBulbIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Suggestions</p>
              <p className="text-2xl font-bold text-[#1B263B]">{suggestionsDuJour.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Tournées acceptées</p>
              <p className="text-2xl font-bold text-[#1B263B]">{tourneesDuJour.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#1B263B]/70">Temps économisé</p>
              <p className="text-2xl font-bold text-[#1B263B]">
                {suggestionsDuJour.reduce((sum, s) => sum + s.economieTemps, 0)}min
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {activeTab === "suggestions" ? (
          // Onglet Suggestions
          suggestionsDuJour.length === 0 ? (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <LightBulbIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-[#1B263B] mb-2">Aucune suggestion de tournée</h3>
              <p className="text-[#1B263B]/70">Assurez-vous d'avoir des rendez-vous confirmés pour cette date.</p>
            </div>
          ) : (
            suggestionsDuJour.map((suggestion) => (
              <div key={suggestion.id} className="rounded-lg border border-[#1B263B]/10 bg-white">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <TruckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-[#1B263B]">{suggestion.nom}</h3>
                          <p className="text-sm text-gray-600">{suggestion.zone} • {suggestion.date}</p>
                        </div>
                      </div>
                      
                      {/* Métriques essentielles */}
                      <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{suggestion.heureDebut} - {suggestion.heureFin}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{suggestion.distanceTotale} km</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SparklesIcon className="h-4 w-4" />
                          <span>{suggestion.rendezVous.length} arrêts</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span className="text-orange-600 font-medium">-{suggestion.economieTemps}min</span>
                        </div>
                      </div>
                      
                      {/* Itinéraire suggéré */}
                      <div className="mb-4">
                        <h4 className="text-sm sm:text-base font-semibold text-[#1B263B] mb-3">Itinéraire suggéré</h4>
                        <div className="space-y-4 sm:space-y-6">
                          {suggestion.rendezVous.map((rdv, index) => (
                            <div key={rdv.id} className="flex items-start space-x-3 sm:space-x-4">
                              <div className="flex-shrink-0 pt-1">
                                <div className="text-sm sm:text-base font-medium text-[#1B263B]">
                                  {rdv.heure}
                                </div>
                              </div>
                              <div className="w-px h-16 sm:h-20 bg-gray-300 mt-1"></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div>
                                    <h5 className="text-xs sm:text-sm font-medium text-[#1B263B]">{rdv.client}</h5>
                                    <p className="text-xs sm:text-sm text-gray-600">{rdv.equide}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">{rdv.adresse}, {rdv.ville}</p>
                                  </div>
                                  <div className="flex items-center space-x-2 sm:ml-4">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                      Étape {index + 1}
                                    </span>
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                                      rdv.statut === 'confirmé' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {rdv.statut}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-6">
                      <button
                        onClick={() => handleVoirDetails(suggestion)}
                        className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Voir détails</span>
                      </button>
                      <button
                        onClick={() => handleAccepter(suggestion.id)}
                        className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                        style={{backgroundColor: '#f76f4d'}}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e55a3a'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f76f4d'}
                      >
                        <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Accepter</span>
                      </button>
                      <button
                        onClick={() => handleRejeter(suggestion.id)}
                        className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-red-100 text-red-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          // Onglet Mes tournées
          tourneesDuJour.length === 0 ? (
            <div className="rounded-lg border border-[#1B263B]/10 bg-white p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <TruckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-[#1B263B] mb-2">Aucune tournée acceptée</h3>
              <p className="text-[#1B263B]/70">Vous n'avez pas encore accepté de tournées pour cette date.</p>
            </div>
          ) : (
            tourneesDuJour.map((tournee) => (
              <div key={tournee.id} className="rounded-lg border border-[#1B263B]/10 bg-white">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TruckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-[#1B263B]">{tournee.nom}</h3>
                          <p className="text-sm text-gray-600">{tournee.zone} • {tournee.date}</p>
                        </div>
                      </div>
                      
                      {/* Métriques principales */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600">Horaires</p>
                              <p className="text-base sm:text-lg font-semibold text-[#1B263B]">
                                {tournee.heureDebut} - {tournee.heureFin}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600">Distance</p>
                              <p className="text-base sm:text-lg font-semibold text-[#1B263B]">
                                {tournee.distanceTotale} km
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600">Arrêts</p>
                              <p className="text-base sm:text-lg font-semibold text-[#1B263B]">
                                {tournee.rendezVous.length}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600">Économie</p>
                              <p className="text-base sm:text-lg font-semibold text-[#1B263B]">
                                {tournee.economieTemps}min
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Itinéraire */}
                      <div className="mb-4">
                        <h4 className="text-sm sm:text-base font-semibold text-[#1B263B] mb-3">Itinéraire</h4>
                        <div className="space-y-4 sm:space-y-6">
                          {tournee.rendezVous.map((rdv, index) => (
                            <div key={rdv.id} className="flex items-start space-x-3 sm:space-x-4">
                              <div className="flex-shrink-0 pt-1">
                                <div className="text-sm sm:text-base font-medium text-[#1B263B]">
                                  {rdv.heure}
                                </div>
                              </div>
                              <div className="w-px h-16 sm:h-20 bg-gray-300 mt-1"></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div>
                                    <h5 className="text-xs sm:text-sm font-medium text-[#1B263B]">{rdv.client}</h5>
                                    <p className="text-xs sm:text-sm text-gray-600">{rdv.equide}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">{rdv.adresse}, {rdv.ville}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                      Étape {index + 1}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      rdv.statut === 'confirmé' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {rdv.statut}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-6">
                      <button
                        onClick={() => handleVoirDetails(tournee)}
                        className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Voir détails</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </motion.div>

      {/* Modal de détails - Refonte complète */}
      <AnimatePresence>
        {isModalOpen && selectedTournee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleFermerModal}
            />
            
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl max-w-full sm:max-w-4xl w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {/* En-tête avec gradient et métriques clés */}
              <div className="bg-gradient-to-r from-[#F86F4D]/5 to-[#1B263B]/5 p-4 sm:p-6 border-b border-[#1B263B]/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 sm:p-3 bg-[#F86F4D]/10 rounded-lg flex-shrink-0">
                      <MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F86F4D]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-[#1B263B] truncate">
                        {selectedTournee.nom}
                      </h2>
                      <p className="text-sm text-[#1B263B]/70 truncate">
                        {new Date(selectedTournee.date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} • {selectedTournee.heureDebut} - {selectedTournee.heureFin}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="px-3 py-1 bg-[#F86F4D]/10 rounded-full">
                      <span className="text-sm font-bold text-[#F86F4D]">{selectedTournee.score}/100</span>
                    </div>
                    <button
                      onClick={handleFermerModal}
                      className="p-2 text-[#1B263B]/70 hover:text-[#1B263B] hover:bg-[#1B263B]/5 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Métriques principales */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 bg-white rounded-lg border border-[#1B263B]/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F86F4D]/10 rounded-lg">
                        <ClockIcon className="h-4 w-4 text-[#F86F4D]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Durée</p>
                        <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.dureeTotale}min</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#1B263B]/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F86F4D]/10 rounded-lg">
                        <MapPinIcon className="h-4 w-4 text-[#F86F4D]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Distance</p>
                        <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.distanceTotale}km</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#1B263B]/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F86F4D]/10 rounded-lg">
                        <UserGroupIcon className="h-4 w-4 text-[#F86F4D]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Arrêts</p>
                        <p className="text-sm font-bold text-[#1B263B]">{selectedTournee.rendezVous.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#1B263B]/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <SparklesIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Économie</p>
                        <p className="text-sm font-bold text-green-600">{selectedTournee.economieTemps}min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu principal */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  {/* Vue d'ensemble - Zone et rayon */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-[#1B263B]/10">
                    <h3 className="font-semibold text-[#1B263B] mb-3 text-sm sm:text-base">Zone de couverture</h3>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-[#1B263B]/70" />
                      <span className="text-sm text-[#1B263B]">{selectedTournee.zone}</span>
                      <span className="text-xs text-[#1B263B]/50">•</span>
                      <span className="text-xs text-[#1B263B]/70">Rayon de {Math.round(selectedTournee.distanceTotale / 2)}km</span>
                    </div>
                  </div>

                  {/* Timeline des rendez-vous */}
                  <div>
                    <h3 className="font-semibold text-[#1B263B] mb-4 text-sm sm:text-base">Itinéraire optimisé</h3>
                    <div className="space-y-4">
                      {selectedTournee.rendezVous.map((rdv, index) => (
                        <div key={rdv.id} className="relative">
                          {/* Ligne de connexion */}
                          {index < selectedTournee.rendezVous.length - 1 && (
                            <div className="absolute left-4 top-12 w-px h-8 bg-[#1B263B]/20"></div>
                          )}
                          
                          <div className="flex items-start gap-4">
                            {/* Indicateur d'étape */}
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-[#F86F4D] rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{index + 1}</span>
                              </div>
                            </div>
                            
                            {/* Contenu du rendez-vous */}
                            <div className="flex-1 min-w-0">
                              <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-[#1B263B] text-sm sm:text-base truncate">
                                      {rdv.client}
                                    </h4>
                                    <p className="text-sm text-[#1B263B]/70 truncate">{rdv.equide}</p>
                                    <p className="text-xs text-[#1B263B]/50 truncate">{rdv.adresse}, {rdv.ville}</p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                    <span className="text-sm font-medium text-[#1B263B]">{rdv.heure}</span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      rdv.statut === 'confirmé' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {rdv.statut}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs text-[#1B263B]/70">
                                  <div className="flex items-center gap-1">
                                    <ClockIcon className="h-3 w-3" />
                                    <span>{rdv.duree}min</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TagIcon className="h-3 w-3" />
                                    <span>{rdv.type}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes optionnelles */}
                  {'notes' in selectedTournee && selectedTournee.notes && (
                    <div>
                      <h3 className="font-semibold text-[#1B263B] mb-3 text-sm sm:text-base">Notes</h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-[#1B263B]/10">
                        <p className="text-sm text-[#1B263B]/70">{selectedTournee.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer avec actions et statistiques */}
              <div className="bg-gray-50 border-t border-[#1B263B]/10 p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Statistiques de bénéfices */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white rounded-lg border border-[#1B263B]/10">
                      <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Temps économisé</p>
                      <p className="text-lg font-bold text-green-600">{selectedTournee.economieTemps}min</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#1B263B]/10">
                      <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Carburant économisé</p>
                      <p className="text-lg font-bold text-green-600">~{Math.round(selectedTournee.distanceTotale * 0.1)}L</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#1B263B]/10">
                      <p className="text-xs font-medium text-[#1B263B]/70 uppercase tracking-wide">Efficacité</p>
                      <p className="text-lg font-bold text-[#F86F4D]">{selectedTournee.score}%</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        handleAccepter(selectedTournee.id);
                        handleFermerModal();
                      }}
                      className="flex-1 px-4 py-3 bg-[#F86F4D] text-white font-medium rounded-lg hover:bg-[#e55a3a] transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Accepter la tournée
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implémenter la modification
                        console.log('Modifier la tournée');
                      }}
                      className="flex-1 px-4 py-3 bg-white border border-[#1B263B]/20 text-[#1B263B] font-medium rounded-lg hover:bg-[#1B263B]/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        handleRejeter(selectedTournee.id);
                        handleFermerModal();
                      }}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}