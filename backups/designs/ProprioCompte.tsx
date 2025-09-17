"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UserIcon, 
  BellIcon,
  KeyIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";


export default function ProprioCompte() {
  const [activeSection, setActiveSection] = useState('profil');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@email.com",
    telephone: "06 12 34 56 78",
    adresse: "123 Rue de la Paix",
    ville: "Paris",
    codePostal: "75001",
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

  const sections = [
    { id: 'profil', label: 'Profil personnel', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
    { id: 'securite', label: 'Sécurité', icon: <KeyIcon className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B]">Mon profil</h1>
        <p className="text-sm sm:text-base text-[#1B263B]/70 mt-1">
          Gérez vos informations personnelles et préférences
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
                  <h2 className="text-lg font-semibold text-[#1B263B]">Profil personnel</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-3 py-2 text-[#F86F4D] border border-[#F86F4D] rounded-lg hover:bg-[#F86F4D]/10 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{isEditing ? 'Annuler' : 'Modifier'}</span>
                  </button>
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



                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Adresse</label>
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Ville</label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Code postal</label>
                    <input
                      type="text"
                      value={formData.codePostal}
                      onChange={(e) => handleInputChange('codePostal', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
