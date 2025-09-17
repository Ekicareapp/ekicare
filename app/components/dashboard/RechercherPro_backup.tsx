"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { fetchGooglePlacesSuggestions, LocalisationSuggestion } from "@/lib/googlePlaces";

interface Professionnel {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  telephone: string;
  profession: string;
  adresse: string;
  ville: string;
  code_postal: string;
  description: string;
  experience: number;
  tarif_min: number;
  tarif_max: number;
  rayon_exercice: number;
  siret: string;
  distance: number;
  coordonnees: {
    lat: number;
    lon: number;
  };
  users: {
    email: string;
    role: string;
  };
}

export default function RechercherPro() {
  const { data: session } = useSession();
  const [proprioProfile, setProprioProfile] = useState({
    ville: "",
    codePostal: ""
  });
  const [profession, setProfession] = useState("Toutes les professions");
  const [localisation, setLocalisation] = useState("Paris (75001)");
  const [resultats, setResultats] = useState<Professionnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    ville: "",
    codePostal: "",
    profession: "Toutes les professions",
    rayonRecherche: 50
  });
  const [suggestions, setSuggestions] = useState<LocalisationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profilSelectionne, setProfilSelectionne] = useState<Professionnel | null>(null);
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const [proRdvSelectionne, setProRdvSelectionne] = useState<Professionnel | null>(null);
  const [rdvFormData, setRdvFormData] = useState({
    date: "",
    heure: "",
    description: "",
    equides: [] as string[],
    datesAlternatives: [] as string[],
    adresse: ""
  });
  const [adresseSuggestions, setAdresseSuggestions] = useState<string[]>([]);
  const [localisationSuggestions, setLocalisationSuggestions] = useState<string[]>([]);
  const [localisationInput, setLocalisationInput] = useState("Paris (75001)");
  const [showLocalisationSuggestions, setShowLocalisationSuggestions] = useState(false);

  // Charger le profil du propriétaire
  useEffect(() => {
    const loadProprioProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('proprio_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profile) {
          setProprioProfile({
            ville: profile.ville || "",
            codePostal: profile.code_postal || ""
          });
          setSearchParams(prev => ({
            ...prev,
            ville: profile.ville || "",
            codePostal: profile.code_postal || ""
          }));
        }
      } catch (error) {
        console.error("Erreur chargement profil proprio:", error);
      }
    };

    loadProprioProfile();
  }, [session]);

  // Fonction pour gérer le changement de localisation
  const handleLocalisationChange = (value: string) => {
    setLocalisationInput(value);
    setLocalisation(value);
    fetchLocalisationSuggestions(value);
  };

  // Fonction pour gérer la sélection d'une suggestion
  const handleLocalisationSelect = (suggestion: string) => {
    setLocalisationInput(suggestion);
    setLocalisation(suggestion);
    setShowLocalisationSuggestions(false);
  };

  // Fonction pour gérer le blur de l'input
  const handleLocalisationBlur = () => {
    setTimeout(() => setShowLocalisationSuggestions(false), 200);
  };

  // Fonction de recherche (alias pour handleSearch)
  const handleRecherche = handleSearch;

  // Fonction pour voir la fiche du professionnel
  const handleVoirFiche = (pro: Professionnel) => {
    setProfilSelectionne(pro);
  };

  // Fonction pour fermer la popup
  const handleFermerPopup = () => {
    setProfilSelectionne(null);
  };

  // Fonction pour prendre rendez-vous
  const handlePrendreRDV = (pro: Professionnel) => {
    setProRdvSelectionne(pro);
    setIsRdvModalOpen(true);
  };

  // Fonction pour fermer le modal de RDV
  const handleFermerRdvModal = () => {
    setIsRdvModalOpen(false);
    setProRdvSelectionne(null);
    setRdvFormData({
      date: "",
      heure: "",
      description: "",
      equides: [],
      datesAlternatives: [],
      adresse: ""
    });
  };

  // Fonction de recherche
  const handleSearch = async () => {
    if (!localisation.trim()) {
      alert("Veuillez entrer une localisation");
      return;
    }

    setLoading(true);
    try {
      // Extraire ville et code postal de la localisation
      const [ville, codePostal] = localisation.split(' (');
      const codePostalClean = codePostal ? codePostal.replace(')', '') : '';

      const response = await fetch("/api/search/professionnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ville: ville,
          codePostal: codePostalClean,
          profession: profession,
          rayonRecherche: 50 // Rayon par défaut
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResultats(data.professionnels);
        console.log("Professionnels trouvés:", data.professionnels.length);
      } else {
        const error = await response.json();
        alert("Erreur: " + error.message);
      }
    } catch (error) {
      console.error("Erreur recherche:", error);
      alert("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les suggestions de localisation depuis Google Places
  const fetchLocalisationSuggestions = async (input: string) => {
    if (!input || input.length < 2) {
      setLocalisationSuggestions([]);
      setShowLocalisationSuggestions(false);
      return;
    }

    try {
      // Utiliser l'API Google Places réelle
      const suggestions = await fetchGooglePlacesSuggestions(input);
      
      if (suggestions.length > 0) {
        const formattedSuggestions = suggestions.map(suggestion => 
          suggestion.structured_formatting?.main_text && suggestion.structured_formatting?.secondary_text
            ? `${suggestion.structured_formatting.main_text}, ${suggestion.structured_formatting.secondary_text}`
            : suggestion.description
        );
        
        setLocalisationSuggestions(formattedSuggestions);
        setShowLocalisationSuggestions(true);
      } else {
        // Fallback avec des suggestions simulées si l'API n'est pas configurée
        const mockSuggestions = [
          `${input}, France`,
          `${input} (75), France`,
          `${input} (69), France`,
          `${input} (13), France`,
          `${input} (06), France`
        ].filter(suggestion => 
          suggestion.toLowerCase().includes(input.toLowerCase())
        );
        
        setLocalisationSuggestions(mockSuggestions);
        setShowLocalisationSuggestions(true);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      
      // Fallback avec des suggestions simulées en cas d'erreur
      const mockSuggestions = [
        `${input}, France`,
        `${input} (75), France`,
        `${input} (69), France`,
        `${input} (13), France`,
        `${input} (06), France`
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(input.toLowerCase())
      );
      
      setLocalisationSuggestions(mockSuggestions);
      setShowLocalisationSuggestions(true);
    }
  };

  // Liste des professions disponibles
  const professions = [
    "Toutes les professions",
    "Vétérinaire",
    "Ostéopathe",
    "Maréchal-ferrant",
    "Dentiste équin",
    "Physiothérapeute",
    "Comportementaliste",
    "Éducateur équin",
    "Masseur équin"
  ];

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
          Rechercher un professionnel
        </h1>
        <p className="text-[#1B263B]/70">
          Trouvez le professionnel idéal pour vos équidés.
        </p>
      </motion.div>

      {/* Champs de recherche */}
      <motion.div 
        className="bg-white rounded-lg border border-[#1B263B]/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Dropdown Profession */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#1B263B]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent appearance-none bg-white"
            >
              {professions.map((prof) => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-[#1B263B]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Champ Localisation */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#1B263B]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Localisation"
                value={localisationInput}
                onChange={(e) => handleLocalisationChange(e.target.value)}
                onBlur={handleLocalisationBlur}
                onFocus={() => localisationSuggestions.length > 0 && setShowLocalisationSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
              />
              {showLocalisationSuggestions && localisationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#1B263B]/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {localisationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-[#F86F4D]/10 cursor-pointer border-b border-[#1B263B]/10 last:border-b-0"
                      onClick={() => handleLocalisationSelect(suggestion)}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-[#1B263B]/60 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-[#1B263B]">{suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bouton Rechercher */}
          <button
            onClick={handleRecherche}
            className="sm:col-span-2 lg:col-span-1 px-6 py-3 bg-[#F86F4D] text-white font-medium rounded-lg hover:bg-[#F86F4D]/90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Rechercher
          </button>
        </div>
      </motion.div>

      {/* Résultats */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1B263B]">
            {loading ? "Recherche en cours..." : `${resultats.length} professionnel${resultats.length > 1 ? 's' : ''} trouvé${resultats.length > 1 ? 's' : ''}`}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-[#1B263B]/70">Recherche des professionnels...</p>
          </div>
        ) : resultats.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1B263B] mb-2">
              {resultats.length === 0 && (profession !== "Toutes les professions" || localisation) ? "Aucun professionnel trouvé" : "Commencez votre recherche"}
            </h3>
            <p className="text-[#1B263B]/70">
              {resultats.length === 0 && (profession !== "Toutes les professions" || localisation)
                ? `Aucun professionnel trouvé pour "${profession}" ${localisation ? `dans "${localisation}"` : ''}. Essayez d'autres critères.`
                : "Sélectionnez une profession et/ou une localisation, puis cliquez sur 'Rechercher'."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resultats.map((pro, index) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                {/* Photo de profil et informations */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#1B263B]">
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {pro.prenom[0]}{pro.nom[0]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B263B] mb-1">{pro.prenom} {pro.nom}</h3>
                    <p className="text-[#F86F4D] font-medium text-sm sm:text-base">{pro.profession}</p>
                  </div>
                </div>

                {/* Localisation */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1B263B]/70 mb-2 sm:mb-3">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{pro.ville} • {pro.distance} km</span>
                </div>

                {/* Années d'expérience */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1B263B]/70 mb-3 sm:mb-4">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{pro.experience || 0} ans d'expérience</span>
                </div>

                {/* Aperçu de la bio */}
                <p className="text-xs sm:text-sm text-[#1B263B]/70 mb-3 sm:mb-4 line-clamp-3">
                  {pro.description}
                </p>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => handleVoirFiche(pro)}
                    className="flex-1 px-3 sm:px-4 py-2 border border-[#1B263B] text-[#1B263B] text-xs sm:text-sm font-medium rounded-md hover:bg-[#1B263B]/5 transition-colors"
                  >
                    Voir la fiche du pro
                  </button>
                  <button
                    onClick={() => handlePrendreRDV(pro)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-[#1B263B] text-white text-xs sm:text-sm font-medium rounded-md hover:bg-[#1B263B]/90 transition-colors"
                  >
                    Prendre rendez-vous
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}