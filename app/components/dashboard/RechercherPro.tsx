"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { useDisponibilites } from "../../../hooks/useDisponibilites";
import { useEquides } from "../../../hooks/useEquides";
import AddressAutocomplete from "../ui/AddressAutocomplete";
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
  photo_profil: string | null;
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
  
  // Hook pour gérer les disponibilités du professionnel sélectionné
  const {
    disponibilites,
    dureeConsultation,
    loading: loadingDisponibilites,
    error: errorDisponibilites,
    genererCreneaux,
    isJourDisponible,
    getNomJour,
    getJourFromDate
  } = useDisponibilites(proRdvSelectionne?.id || null);
  
  // Hook pour récupérer les équidés du propriétaire
  const { equides, loading: loadingEquides, error: errorEquides } = useEquides();
  
  const [rdvFormData, setRdvFormData] = useState({
    date: "",
    heure: "",
    description: "",
    equides: [] as string[],
    creneauxAlternatifs: [] as { date: string; heure: string }[],
    adresse: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
      creneauxAlternatifs: [],
      adresse: ""
    });
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  // Fonction pour ajouter un créneau alternatif
  const handleAjouterCreneauAlternatif = () => {
    setRdvFormData(prev => ({
      ...prev,
      creneauxAlternatifs: [...prev.creneauxAlternatifs, { date: "", heure: "" }]
    }));
  };

  // Fonction pour supprimer un créneau alternatif
  const handleSupprimerCreneauAlternatif = (index: number) => {
    setRdvFormData(prev => ({
      ...prev,
      creneauxAlternatifs: prev.creneauxAlternatifs.filter((_, i) => i !== index)
    }));
  };

  // Fonction pour mettre à jour un créneau alternatif
  const handleUpdateCreneauAlternatif = (index: number, field: 'date' | 'heure', value: string) => {
    setRdvFormData(prev => ({
      ...prev,
      creneauxAlternatifs: prev.creneauxAlternatifs.map((creneau, i) => 
        i === index ? { ...creneau, [field]: value } : creneau
      )
    }));
  };

  // Fonction pour soumettre la demande de RDV
  const handleSubmitRdv = async () => {
    if (!proRdvSelectionne) return;

    // Protection contre les soumissions multiples
    if (isSubmitting) {
      console.log('Soumission déjà en cours, ignorée');
      return;
    }

    // Validation
    if (!rdvFormData.date || !rdvFormData.heure || !rdvFormData.description || !rdvFormData.adresse || rdvFormData.equides.length === 0) {
      setSubmitError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/demandes/rdv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proId: proRdvSelectionne.id,
          date: rdvFormData.date,
          heure: rdvFormData.heure,
          description: rdvFormData.description,
          adresse: rdvFormData.adresse,
          equides: rdvFormData.equides,
          creneauxAlternatifs: rdvFormData.creneauxAlternatifs.filter(c => c.date && c.heure)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de la demande');
      }

      // Sauvegarder la demande dans localStorage
      if (data.demande) {
        const existingDemandes = JSON.parse(localStorage.getItem('ekicare_demandes') || '[]');
        existingDemandes.push(data.demande);
        localStorage.setItem('ekicare_demandes', JSON.stringify(existingDemandes));
        
        // Déclencher un événement pour notifier les autres composants
        window.dispatchEvent(new Event('storage'));
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        handleFermerRdvModal();
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
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
              <AddressAutocomplete
                value={localisationInput}
                onChange={(value) => {
                  setLocalisationInput(value);
                  setLocalisation(value);
                }}
                onSelect={(address) => {
                  setLocalisationInput(address);
                  setLocalisation(address);
                }}
                placeholder="Localisation"
                className="w-full pl-10 pr-4 py-3"
              />
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
                    {pro.photo_profil ? (
                      <img
                        src={pro.photo_profil}
                        alt={`${pro.prenom} ${pro.nom}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                        {pro.prenom[0]}{pro.nom[0]}
                      </div>
                    )}
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

      {/* Popup de profil du professionnel */}
      {profilSelectionne && (
        <div 
          className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={handleFermerPopup}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto border border-[#1B263B]/10 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête de la popup */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-[#1B263B]/10">
              <h2 className="text-lg sm:text-xl font-semibold text-[#1B263B]">Fiche du professionnel</h2>
              <button
                onClick={handleFermerPopup}
                className="p-1.5 sm:p-2 hover:bg-[#F86F4D]/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1B263B]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu de la popup */}
            <div className="p-3 sm:p-6 space-y-6">
              {/* Photo et infos principales */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#1B263B]">
                  {profilSelectionne.photo_profil ? (
                    <img
                      src={profilSelectionne.photo_profil}
                      alt={`${profilSelectionne.prenom} ${profilSelectionne.nom}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                      {profilSelectionne.prenom[0]}{profilSelectionne.nom[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1B263B] mb-1">{profilSelectionne.prenom} {profilSelectionne.nom}</h3>
                  <p className="text-[#F86F4D] font-medium text-lg sm:text-xl mb-2">{profilSelectionne.profession}</p>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-[#1B263B]/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                    <span>{profilSelectionne.ville} • {profilSelectionne.distance} km</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-[#1B263B] mb-3">Description</h4>
                <p className="text-[#1B263B]/70 leading-relaxed">{profilSelectionne.description}</p>
                </div>

              {/* Informations de contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-[#1B263B] mb-3">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#1B263B]/70">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{profilSelectionne.users.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1B263B]/70">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{profilSelectionne.telephone}</span>
                    </div>
                </div>
              </div>

                <div>
                  <h4 className="text-lg font-semibold text-[#1B263B] mb-3">Informations</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#1B263B]/70">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{profilSelectionne.experience || 0} ans d'expérience</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1B263B]/70">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>Rayon d'exercice: {profilSelectionne.rayon_exercice} km</span>
                </div>
                    {profilSelectionne.tarif_min > 0 && (
                      <div className="flex items-center gap-2 text-[#1B263B]/70">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span>Tarifs: {profilSelectionne.tarif_min}€ - {profilSelectionne.tarif_max}€</span>
              </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#1B263B]/10">
                <button
                  onClick={handleFermerPopup}
                  className="flex-1 px-4 py-2.5 border border-[#1B263B]/20 text-[#1B263B] font-medium rounded-md hover:bg-[#1B263B]/5 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleFermerPopup();
                    handlePrendreRDV(profilSelectionne);
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#F86F4D] text-white font-medium rounded-md hover:bg-[#F86F4D]/90 transition-colors"
                >
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de prise de RDV */}
      {isRdvModalOpen && proRdvSelectionne && (
        <div 
          className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={handleFermerRdvModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto border border-[#1B263B]/10 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête du modal */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-[#1B263B]/10">
              <h2 className="text-lg sm:text-xl font-semibold text-[#1B263B]">
                Prendre rendez-vous avec {proRdvSelectionne.prenom} {proRdvSelectionne.nom}
              </h2>
              <button
                onClick={handleFermerRdvModal}
                className="p-1.5 sm:p-2 hover:bg-[#F86F4D]/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1B263B]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-3 sm:p-6 space-y-6">
                    {/* Informations sur les disponibilités */}
                    {disponibilites && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Durée moyenne des consultations : {dureeConsultation}min</span>
                        </div>
                      </div>
                    )}

              {/* Formulaire de RDV */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B263B] mb-2">
                      Date souhaitée *
                    </label>
                    <p className="text-xs text-[#1B263B]/60 mb-2">
                      Le professionnel n'est pas disponible le dimanche
                    </p>
                    <input
                      type="date"
                      value={rdvFormData.date}
                      onChange={(e) => {
                        setRdvFormData(prev => ({ ...prev, date: e.target.value, heure: "" }));
                      }}
                      className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        colorScheme: 'light'
                      }}
                    />
                    {rdvFormData.date && !isJourDisponible(getJourFromDate(rdvFormData.date)) && (
                      <p className="mt-1 text-sm text-red-600">
                        {proRdvSelectionne?.prenom} n'est pas disponible le {getNomJour(getJourFromDate(rdvFormData.date))}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B263B] mb-2">
                      Heure souhaitée *
                    </label>
                    {loadingDisponibilites ? (
                      <div className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg bg-gray-50 text-gray-500">
                        Chargement des disponibilités...
                      </div>
                    ) : rdvFormData.date && isJourDisponible(getJourFromDate(rdvFormData.date)) ? (
                      <select
                        value={rdvFormData.heure}
                        onChange={(e) => setRdvFormData(prev => ({ ...prev, heure: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                      >
                        <option value="">Sélectionnez une heure</option>
                        {genererCreneaux(getJourFromDate(rdvFormData.date), rdvFormData.date).map((creneau) => (
                          <option key={creneau.heure} value={creneau.heure}>
                            {creneau.label} ({dureeConsultation}min)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg bg-gray-50 text-gray-500">
                        {rdvFormData.date ? 
                          `${proRdvSelectionne?.prenom} n'est pas disponible le ${getNomJour(getJourFromDate(rdvFormData.date))}` : 
                          "Sélectionnez d'abord une date"
                        }
                      </div>
                    )}
                    {rdvFormData.date && isJourDisponible(getJourFromDate(rdvFormData.date)) && (
                      <p className="mt-1 text-xs text-[#1B263B]/60">
                        Créneaux de {dureeConsultation} minutes selon les disponibilités de {proRdvSelectionne?.prenom}
                      </p>
                    )}
                  </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Adresse de rendez-vous *
                  </label>
                  <AddressAutocomplete
                    value={rdvFormData.adresse}
                    onChange={(value) => setRdvFormData(prev => ({ ...prev, adresse: value }))}
                    onSelect={(address) => setRdvFormData(prev => ({ ...prev, adresse: address }))}
                    placeholder="Adresse complète"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Description / Motif de la consultation *
                  </label>
                  <textarea
                    value={rdvFormData.description}
                    onChange={(e) => setRdvFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    rows={4}
                    placeholder="Décrivez le motif de votre consultation..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-3">
                    Équidés concernés *
                  </label>
                  {loadingEquides ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F86F4D]"></div>
                      <span className="ml-2 text-sm text-[#1B263B]/60">Chargement de vos équidés...</span>
                    </div>
                  ) : errorEquides ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">Erreur lors du chargement des équidés: {errorEquides}</p>
                    </div>
                  ) : equides.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        Vous n'avez pas encore d'équidés enregistrés. 
                        <a href="/dashboard/proprio/equides" className="text-[#F86F4D] hover:underline ml-1">
                          Ajoutez-en un ici
                        </a>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {equides.map((equide) => (
                        <label key={equide.id} className="flex items-center space-x-3 cursor-pointer py-2 border-b border-[#1B263B]/5 last:border-b-0 hover:bg-gray-50 rounded px-2">
                          <input
                            type="checkbox"
                            checked={rdvFormData.equides.includes(equide.id)}
                            onChange={() => {
                              const newEquides = rdvFormData.equides.includes(equide.id)
                                ? rdvFormData.equides.filter(id => id !== equide.id)
                                : [...rdvFormData.equides, equide.id];
                              setRdvFormData(prev => ({ ...prev, equides: newEquides }));
                            }}
                            className="w-4 h-4 text-[#F86F4D] border-[#1B263B]/20 rounded focus:ring-[#F86F4D] focus:ring-1"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-[#1B263B]">{equide.nom}</span>
                            <span className="text-xs text-[#1B263B]/60 ml-2">
                              {equide.race} • {equide.age} ans • {equide.sexe}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                        )}
                </div>

                {/* Créneaux alternatifs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-[#1B263B]">
                      Créneaux alternatifs (optionnel)
                    </label>
                    <button
                      type="button"
                      onClick={handleAjouterCreneauAlternatif}
                      className="text-xs text-[#F86F4D] hover:text-[#F86F4D]/80 font-medium"
                    >
                      + Ajouter un créneau
                    </button>
                  </div>
                  <p className="text-xs text-[#1B263B]/60 mb-3">
                    Proposez des créneaux alternatifs si le professionnel n'est pas disponible à votre heure préférée
                  </p>
                  
                  {rdvFormData.creneauxAlternatifs.length === 0 ? (
                    <div className="text-center py-4 text-sm text-[#1B263B]/60 border-2 border-dashed border-[#1B263B]/20 rounded-lg">
                      Aucun créneau alternatif proposé
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rdvFormData.creneauxAlternatifs.map((creneau, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={creneau.date}
                              onChange={(e) => handleUpdateCreneauAlternatif(index, 'date', e.target.value)}
                              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                              min={new Date().toISOString().split('T')[0]}
                            />
                            <select
                              value={creneau.heure}
                              onChange={(e) => handleUpdateCreneauAlternatif(index, 'heure', e.target.value)}
                              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                            >
                              <option value="">Heure</option>
                              {creneau.date && isJourDisponible(getJourFromDate(creneau.date)) ? (
                                genererCreneaux(getJourFromDate(creneau.date), creneau.date).map((c) => (
                                  <option key={c.heure} value={c.heure}>
                                    {c.label}
                                  </option>
                                ))
                              ) : (
                                <>
                                  <option value="08:00">08:00</option>
                                  <option value="09:00">09:00</option>
                                  <option value="10:00">10:00</option>
                                  <option value="11:00">11:00</option>
                                  <option value="14:00">14:00</option>
                                  <option value="15:00">15:00</option>
                                  <option value="16:00">16:00</option>
                                  <option value="17:00">17:00</option>
                                </>
                              )}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSupprimerCreneauAlternatif(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

                  {/* Note d'information */}
                  <div className="border border-[#1B263B]/10 rounded-lg p-4">
                    <h4 className="font-medium text-[#1B263B] mb-2">Information importante</h4>
                    <p className="text-sm text-[#1B263B]/70">
                      Cette demande sera envoyée au professionnel qui pourra l'accepter ou la refuser.
                    </p>
                  </div>

              {/* Messages d'erreur et de succès */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">❌ {submitError}</p>
                </div>
              )}
              
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-600">✅ Demande envoyée avec succès !</p>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#1B263B]/10">
                <button
                  onClick={handleFermerRdvModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 border border-[#1B263B]/20 text-[#1B263B] font-medium rounded-md hover:bg-[#1B263B]/5 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitRdv();
                  }}
                  disabled={isSubmitting || !rdvFormData.date || !rdvFormData.heure || !rdvFormData.description || !rdvFormData.adresse || rdvFormData.equides.length === 0}
                  className="flex-1 px-4 py-2.5 bg-[#F86F4D] text-white font-medium rounded-md hover:bg-[#F86F4D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer la demande'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}