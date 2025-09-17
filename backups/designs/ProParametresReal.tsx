"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UserIcon, 
  BellIcon,
  KeyIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon
} from "@heroicons/react/24/outline";

export default function ProParametresReal() {
  const [activeSection, setActiveSection] = useState('profil');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: "Dr. Marie",
    prenom: "Dubois",
    email: "marie.dubois@ekicare.com",
    telephone: "06 12 34 56 78",
    pointGeographique: "123 Rue de la Paix, 69001 Lyon",
    rayonIntervention: 20,
    photoProfil: "",
    description: "Vétérinaire spécialisée dans les soins des équidés avec plus de 10 ans d'expérience.",
    notifications: {
      email: true,
      sms: false
    }
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    // Ici on ferait l'appel API pour sauvegarder
    console.log('Sauvegarde des paramètres:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Recharger les données originales
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Ici on ferait l'upload vers un service de stockage
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photoProfil: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    setFormData(prev => ({
      ...prev,
      photoProfil: ""
    }));
  };

  const sections = [
    { id: 'profil', label: 'Profil', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
    { id: 'securite', label: 'Sécurité', icon: <KeyIcon className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B]">Profil</h1>
        <p className="text-sm sm:text-base text-[#1B263B]/70 mt-1">
          Gérez vos informations et préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Navigation latérale */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#F86F4D]/10 text-[#F86F4D]'
                      : 'text-[#1B263B] hover:bg-[#1B263B]/5'
                  }`}
                >
                  <span className={`flex-shrink-0 ${
                    activeSection === section.id ? 'text-[#F86F4D]' : 'text-[#1B263B]/70'
                  }`}>{section.icon}</span>
                  <span className="block text-left font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
            {/* Section Profil */}
            {activeSection === 'profil' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#1B263B]">Profil professionnel</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-3 py-2 text-[#F86F4D] border border-[#F86F4D] rounded-lg hover:bg-[#F86F4D]/10 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{isEditing ? 'Annuler' : 'Modifier'}</span>
                  </button>
                </div>

                {/* Photo de profil */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {formData.photoProfil ? (
                          <img 
                            src={formData.photoProfil} 
                            alt="Photo de profil" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1B263B] rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                            {formData.prenom[0]}{formData.nom[0]}
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="absolute -bottom-2 -right-2 flex gap-1">
                          <label className="bg-[#F86F4D] text-white p-2 rounded-full cursor-pointer hover:bg-[#F86F4D]/90 transition-colors">
                            <CameraIcon className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          {formData.photoProfil && (
                            <button
                              onClick={handlePhotoRemove}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#1B263B] mb-2">
                      {formData.prenom} {formData.nom}
                    </h3>
                    <p className="text-sm text-[#1B263B]/70 mb-4">
                      Cette photo sera affichée sur votre profil et dans les résultats de recherche côté propriétaires.
                    </p>
                    {isEditing && (
                      <div className="text-xs text-[#1B263B]/60">
                        Cliquez sur l'icône appareil photo pour changer votre photo de profil
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>


                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">
                      Point géographique de référence *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pointGeographique}
                        onChange={(e) => handleInputChange('pointGeographique', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Ex: 123 Rue de la Paix, 69001 Lyon"
                        className="w-full px-3 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <MapPinIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-[#1B263B]/60 mt-1">
                      Adresse complète qui servira de point de départ pour votre rayon d'intervention
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">
                      Rayon d'intervention *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.rayonIntervention}
                        onChange={(e) => handleInputChange('rayonIntervention', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                      >
                        <option value={5}>5 km</option>
                        <option value={10}>10 km</option>
                        <option value={15}>15 km</option>
                        <option value={20}>20 km</option>
                        <option value={25}>25 km</option>
                        <option value={30}>30 km</option>
                        <option value={40}>40 km</option>
                        <option value={50}>50 km</option>
                        <option value={75}>75 km</option>
                        <option value={100}>100 km</option>
                      </select>
                      <div className="absolute right-3 top-2.5 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-[#1B263B]/60 mt-1">
                      Distance maximale depuis votre point de référence
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#e55a3a] transition-colors flex items-center gap-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Sauvegarder
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Section Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#1B263B]">Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="w-5 h-5 text-[#1B263B]/70" />
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">Notifications par email</p>
                        <p className="text-xs text-[#1B263B]/70">Recevez les notifications par email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={(e) => handleInputChange('notifications.email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F86F4D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F86F4D]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-[#1B263B]/70" />
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">Notifications SMS</p>
                        <p className="text-xs text-[#1B263B]/70">Recevez les notifications par SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.sms}
                        onChange={(e) => handleInputChange('notifications.sms', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F86F4D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F86F4D]"></div>
                    </label>
                  </div>

                </div>
              </div>
            )}


            {/* Section Sécurité */}
            {activeSection === 'securite' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#1B263B]">Sécurité</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">Mot de passe</p>
                        <p className="text-xs text-[#1B263B]/70">Dernière modification il y a 30 jours</p>
                      </div>
                      <button className="px-3 py-2 text-[#F86F4D] border border-[#F86F4D] rounded-lg hover:bg-[#F86F4D]/10 transition-colors text-sm">
                        Modifier
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
