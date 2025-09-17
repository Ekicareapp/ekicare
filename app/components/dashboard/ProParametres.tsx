"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon,
  BellIcon,
  KeyIcon
} from "@heroicons/react/24/outline";

// Types
interface ProfilPro {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profession: string;
  adresse: string;
  ville: string;
  codePostal: string;
  description: string;
  experience: number;
  dureeConsultation: number; // en minutes
  tarifMin: number;
  tarifMax: number;
  disponibilites: {
    jour: string;
    start: string;
    end: string;
  }[];
  certifications: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Profil par défaut
const profilDefaut: ProfilPro = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  profession: "",
  adresse: "",
  ville: "",
  codePostal: "",
  description: "",
  experience: 0,
  dureeConsultation: 60,
  tarifMin: 0,
  tarifMax: 0,
  disponibilites: [],
  certifications: [],
  notifications: {
    email: true,
    sms: true,
    push: false
  }
};

const joursSemaine = [
  { key: "lundi", label: "Lundi", short: "Lun" },
  { key: "mardi", label: "Mardi", short: "Mar" },
  { key: "mercredi", label: "Mercredi", short: "Mer" },
  { key: "jeudi", label: "Jeudi", short: "Jeu" },
  { key: "vendredi", label: "Vendredi", short: "Ven" },
  { key: "samedi", label: "Samedi", short: "Sam" },
  { key: "dimanche", label: "Dimanche", short: "Dim" }
];

export default function ProParametres() {
  const [profil, setProfil] = useState<ProfilPro>(profilDefaut);
  const [activeTab, setActiveTab] = useState("profil");
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setProfil(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDisponibiliteChange = (jour: string, periode: "start" | "end", value: string) => {
    setProfil(prev => {
      const existingIndex = prev.disponibilites.findIndex(d => d.jour === jour);
      if (existingIndex >= 0) {
        const updated = [...prev.disponibilites];
        updated[existingIndex] = { ...updated[existingIndex], [periode]: value };
        return { ...prev, disponibilites: updated };
      } else {
        return {
          ...prev,
          disponibilites: [...prev.disponibilites, { jour, start: "", end: "" }]
        };
      }
    });
  };

  const toggleDay = (jour: string) => {
    setProfil(prev => {
      const exists = prev.disponibilites.find(d => d.jour === jour);
      if (exists) {
        return {
          ...prev,
          disponibilites: prev.disponibilites.filter(d => d.jour !== jour)
        };
      } else {
        return {
          ...prev,
          disponibilites: [...prev.disponibilites, { jour, start: "08:00", end: "12:00" }]
        };
      }
    });
  };



  const handleCertificationToggle = (certification: string) => {
    setProfil(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleNotificationChange = (type: keyof ProfilPro['notifications'], value: boolean) => {
    setProfil(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handleSave = () => {
    // Ici on sauvegarderait les données
    console.log("Sauvegarde du profil:", profil);
    setIsEditing(false);
  };

  const tabs = [
    { id: "profil", label: "Profil", icon: UserIcon },
    { id: "disponibilites", label: "Disponibilités", icon: ClockIcon },
    { id: "tarifs", label: "Tarifs", icon: CurrencyEuroIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "securite", label: "Sécurité", icon: ShieldCheckIcon }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-[#1B263B]">Paramètres</h1>
        <p className="text-gray-600">Gérez votre profil et vos préférences</p>
      </motion.div>

      {/* Onglets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg border border-[#1B263B]/10"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "text-[#f76f4d]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  style={activeTab === tab.id ? {borderBottomColor: '#f76f4d'} : {}}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Profil */}
          {activeTab === "profil" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1B263B]">Informations personnelles</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{backgroundColor: '#f76f4d'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a3a'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f76f4d'}
                >
                  {isEditing ? "Annuler" : "Modifier"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={profil.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#f76f4d')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={profil.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#f76f4d')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profil.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#f76f4d')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profil.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#f76f4d')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                  <input
                    type="text"
                    value={profil.profession}
                    onChange={(e) => handleInputChange("profession", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#f76f4d')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
                  <input
                    type="number"
                    value={profil.experience}
                    onChange={(e) => handleInputChange("experience", parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#f76f4d')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Adresse"
                    value={profil.adresse}
                    onChange={(e) => handleInputChange("adresse", e.target.value)}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Code postal"
                    value={profil.codePostal}
                    onChange={(e) => handleInputChange("codePostal", e.target.value)}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Ville"
                    value={profil.ville}
                    onChange={(e) => handleInputChange("ville", e.target.value)}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={profil.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                <div className="space-y-2">
                  {profil.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...profil.certifications];
                          newCerts[index] = e.target.value;
                          handleInputChange("certifications", newCerts);
                        }}
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newCerts = profil.certifications.filter((_, i) => i !== index);
                            handleInputChange("certifications", newCerts);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <span className="sr-only">Supprimer</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => handleInputChange("certifications", [...profil.certifications, ""])}
                      className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                    >
                      + Ajouter une certification
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-white rounded-lg transition-colors"
                    style={{backgroundColor: '#f76f4d'}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a3a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f76f4d'}
                  >
                    Sauvegarder
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Onglet Disponibilités */}
          {activeTab === "disponibilites" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-[#1B263B]">Gestion des disponibilités</h2>
                <p className="text-gray-600">Configurez vos créneaux de disponibilité et la durée de vos consultations</p>
              </div>

              {/* Durée de consultation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-3">Durée moyenne des consultations</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={profil.dureeConsultation}
                    onChange={(e) => handleInputChange("dureeConsultation", parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    step="15"
                  />
                  <span className="text-blue-700 font-medium">minutes</span>
                  <div className="text-sm text-blue-600">
                    Cette durée définit la taille de chaque créneau disponible
                  </div>
                </div>
              </div>

              {/* Disponibilités par jour */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#1B263B]">Créneaux de disponibilité</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cochez les jours où vous êtes disponible et définissez vos heures de travail
                </p>
                
                {joursSemaine.map((jour) => {
                  const active = profil.disponibilites.some(d => d.jour === jour.label);
                  const current = profil.disponibilites.find(d => d.jour === jour.label) || { start: "08:00", end: "18:00" };
                  return (
                    <div key={jour.key} className={`rounded-xl border-2 p-4 transition-all ${active ? "border-[#F86F4D] bg-[#F86F4D]/5" : "border-gray-200 bg-gray-50"}`}>
                      <div className="flex items-center gap-4">
                        <button 
                          type="button" 
                          onClick={() => toggleDay(jour.label)} 
                          className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all ${active ? "bg-[#F86F4D] border-[#F86F4D] text-white" : "bg-white border-gray-300 hover:border-[#F86F4D]"}`} 
                        >
                          {active && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <div className="w-20 text-sm font-medium text-[#1B263B]">{jour.label}</div>
                        {active ? (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">De</label>
                              <input 
                                type="time" 
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-[#F86F4D]" 
                                value={current.start} 
                                onChange={(e) => handleDisponibiliteChange(jour.label, "start", e.target.value)} 
                              />
                            </div>
                            <span className="text-gray-400">→</span>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">À</label>
                              <input 
                                type="time" 
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-[#F86F4D]" 
                                value={current.end} 
                                onChange={(e) => handleDisponibiliteChange(jour.label, "end", e.target.value)} 
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Non disponible</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Aperçu des créneaux générés */}
              {profil.disponibilites.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-3">Aperçu de vos créneaux (Octobre 2024)</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Simulation des créneaux qui seront proposés aux propriétaires en octobre :
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {(() => {
                      // Simulation simplifiée pour l'aperçu
                      const creneaux = [];
                      const octobre2024 = new Date(2024, 9, 1); // 1er octobre 2024
                      
                      for (let jour = 1; jour <= 7; jour++) {
                        const date = new Date(octobre2024);
                        date.setDate(jour);
                        const jourSemaine = date.toLocaleDateString('fr-FR', { weekday: 'long' });
                        const dispoJour = profil.disponibilites.find(d => d.jour === jourSemaine);
                        
                        if (dispoJour) {
                          const [startHour, startMin] = dispoJour.start.split(':').map(Number);
                          const [endHour, endMin] = dispoJour.end.split(':').map(Number);
                          const startMinutes = startHour * 60 + startMin;
                          const endMinutes = endHour * 60 + endMin;
                          
                          // Générer quelques créneaux représentatifs
                          for (let minutes = startMinutes; minutes + profil.dureeConsultation <= endMinutes; minutes += 30) {
                            const heure = `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
                            creneaux.push({
                              date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                              heure,
                              jour: jourSemaine
                            });
                          }
                        }
                      }
                      
                      return creneaux.slice(0, 12).map((creneau, idx) => (
                        <div key={idx} className="bg-white border border-green-200 rounded px-2 py-1 text-xs">
                          <div className="font-medium text-green-800">{creneau.date}</div>
                          <div className="text-green-600">{creneau.heure}</div>
                        </div>
                      ));
                    })()}
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    * Aperçu des premiers jours d'octobre 2024
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Onglet Tarifs */}
          {activeTab === "tarifs" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-[#1B263B]">Tarifs</h2>
              <p className="text-gray-600">Configurez vos tarifs de consultation</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée moyenne (min)</label>
                  <input
                    type="number"
                    value={profil.dureeConsultation}
                    onChange={(e) => handleInputChange("dureeConsultation", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    min="15"
                    step="15"
                  />
                  <p className="text-xs text-gray-500 mt-1">Durée moyenne d'une consultation</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarif minimum (€)</label>
                  <input
                    type="number"
                    value={profil.tarifMin}
                    onChange={(e) => handleInputChange("tarifMin", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarif maximum (€)</label>
                  <input
                    type="number"
                    value={profil.tarifMax}
                    onChange={(e) => handleInputChange("tarifMax", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#f76f4d'} as React.CSSProperties}
                    onFocus={(e) => e.target.style.borderColor = '#f76f4d'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    min="0"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Onglet Notifications */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-[#1B263B]">Notifications</h2>
              <p className="text-gray-600">Choisissez comment vous souhaitez être notifié</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-[#1B263B]">Email</p>
                      <p className="text-sm text-gray-600">Recevoir les notifications par email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profil.notifications.email}
                      onChange={(e) => handleNotificationChange("email", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f76f4d]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-[#1B263B]">SMS</p>
                      <p className="text-sm text-gray-600">Recevoir les notifications par SMS</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profil.notifications.sms}
                      onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f76f4d]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-[#1B263B]">Notifications push</p>
                      <p className="text-sm text-gray-600">Recevoir les notifications push sur l'appareil</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profil.notifications.push}
                      onChange={(e) => handleNotificationChange("push", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f76f4d]"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === "securite" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-[#1B263B]">Sécurité</h2>
              <p className="text-gray-600">Gérez la sécurité de votre compte</p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-[#1B263B]">Changer le mot de passe</p>
                        <p className="text-sm text-gray-600">Mettez à jour votre mot de passe</p>
                      </div>
                    </div>
                    <button 
                      className="px-4 py-2 text-white rounded-lg transition-colors"
                      style={{backgroundColor: '#f76f4d'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a3a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f76f4d'}
                    >
                      Modifier
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-[#1B263B]">Authentification à deux facteurs</p>
                        <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Activer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
