"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { 
  UserIcon, 
  BellIcon,
  KeyIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import DeleteAccountModal from "../ui/DeleteAccountModal";


export default function ProprioCompte() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState('profil');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    notifications: {
      email: true,
      sms: false
    }
  });

  // Charger les données de l'utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.id) {
        console.log("Pas de session ou pas d'ID utilisateur");
        setLoading(false);
        return;
      }

      try {
        console.log("=== CHARGEMENT DONNÉES UTILISATEUR ===");
        console.log("User ID:", session.user.id);
        console.log("User role:", session.user.role);

        // Récupérer le profil depuis Supabase
        const { data: profile, error } = await supabase
          .from('proprio_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error("Erreur récupération profil:", error);
          setLoading(false);
          return;
        }

        console.log("Profil récupéré:", profile);

        setFormData({
          nom: profile.nom || "",
          prenom: profile.prenom || "",
          email: session.user.email || "",
          telephone: profile.telephone || "",
          adresse: profile.adresse || "",
          ville: profile.ville || "",
          codePostal: profile.code_postal || "",
          notifications: {
            email: true,
            sms: false
          }
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [session]);

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

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Tous les champs sont requis");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        alert("✅ Mot de passe mis à jour avec succès !");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setActiveSection('securite');
      } else {
        const error = await response.json();
        alert("❌ Erreur: " + error.message);
      }
    } catch (error) {
      alert("❌ Erreur: " + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const sections = [
    { id: 'profil', label: 'Profil personnel', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
    { id: 'securite', label: 'Sécurité', icon: <KeyIcon className="w-5 h-5" /> },
    { id: 'compte', label: 'Compte', icon: <TrashIcon className="w-5 h-5" /> }
  ];

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-[#1B263B]/10 p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                        <p className="text-xs text-[#1B263B]/70">Modifiez votre mot de passe pour sécuriser votre compte</p>
                      </div>
                      <button 
                        onClick={() => setActiveSection('changer-mot-de-passe')}
                        className="px-3 py-2 text-[#F86F4D] border border-[#F86F4D] rounded-lg hover:bg-[#F86F4D]/10 transition-colors text-sm"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Compte */}
            {activeSection === 'compte' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#1B263B]">Gestion du compte</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-red-900 mb-1">
                      Zone dangereuse
                    </h3>
                    <p className="text-xs text-red-700 mb-3">
                      Ces actions sont irréversibles et supprimeront définitivement votre compte et toutes vos données.
                    </p>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#F86F4D] rounded-lg hover:bg-[#F86F4D]/90 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section Changer mot de passe */}
            {activeSection === 'changer-mot-de-passe' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#1B263B]">Changer le mot de passe</h2>
                  <button 
                    onClick={() => setActiveSection('securite')}
                    className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">Mot de passe actuel</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <p className="mt-1 text-xs text-[#1B263B]/60">Minimum 8 caractères</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B263B]/70 mb-2">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setActiveSection('securite')}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordLoading}
                      className="px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#e55a3a] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Changement...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Changer le mot de passe
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modal de suppression de compte */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userRole={session?.user?.role || "PROPRIETAIRE"}
      />
    </div>
  );
}
