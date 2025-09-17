"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import AddressAutocomplete from "../ui/AddressAutocomplete";
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
  CameraIcon,
  TrashIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import DeleteAccountModal from "../ui/DeleteAccountModal";
import SimpleToast from "../ui/SimpleToast";
import { useToast } from "../../../hooks/useToast";

export default function ProParametresReal() {
  const { data: session } = useSession();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();
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
    pointGeographique: "",
    rayonIntervention: 50,
    photoProfil: "",
    description: "",
    profession: "",
    siret: "",
    experience: 0,
    dureeConsultation: 60,
    disponibilites: {
      lundi: { matin: true, apresMidi: true, soir: false },
      mardi: { matin: true, apresMidi: true, soir: false },
      mercredi: { matin: true, apresMidi: true, soir: false },
      jeudi: { matin: true, apresMidi: true, soir: false },
      vendredi: { matin: true, apresMidi: true, soir: false },
      samedi: { matin: true, apresMidi: false, soir: false },
      dimanche: { matin: false, apresMidi: false, soir: false }
    },
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
        console.log("=== CHARGEMENT DONNÉES PROFESSIONNEL ===");
        console.log("User ID:", session.user.id);
        console.log("User role:", session.user.role);

        // Récupérer le profil depuis Supabase
        const { data: profile, error } = await supabase
          .from('pro_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error("Erreur récupération profil:", error);
          setLoading(false);
          return;
        }

        console.log("Profil récupéré:", profile);
        console.log("Rayon d'exercice brut:", profile.rayon_exercice);
        console.log("Rayon d'exercice parsé:", parseInt(profile.rayon_exercice));

        setFormData({
          nom: profile.nom || "",
          prenom: profile.prenom || "",
          email: session.user.email || "",
          telephone: profile.telephone || "",
          pointGeographique: profile.ville || "",
          rayonIntervention: parseInt(profile.rayon_exercice) || 50,
          photoProfil: profile.photo_profil || "",
          description: profile.description || "",
          profession: profile.profession || "",
          siret: profile.siret || "",
          experience: profile.experience || 0,
          dureeConsultation: profile.duree_consultation || 60,
          disponibilites: profile.disponibilites || {
            lundi: { matin: true, apresMidi: true, soir: false },
            mardi: { matin: true, apresMidi: true, soir: false },
            mercredi: { matin: true, apresMidi: true, soir: false },
            jeudi: { matin: true, apresMidi: true, soir: false },
            vendredi: { matin: true, apresMidi: true, soir: false },
            samedi: { matin: true, apresMidi: false, soir: false },
            dimanche: { matin: false, apresMidi: false, soir: false }
          },
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

  const handleSave = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      
      // Préparer les données à sauvegarder
      const updateData = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        ville: formData.pointGeographique,
        rayon_exercice: formData.rayonIntervention,
        description: formData.description,
        profession: formData.profession,
        siret: formData.siret,
        experience: formData.experience,
        duree_consultation: formData.dureeConsultation,
        disponibilites: formData.disponibilites,
        updated_at: new Date().toISOString()
      };

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('pro_profiles')
        .update(updateData)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showError('Erreur lors de la sauvegarde des paramètres');
        return;
      }

      console.log('Paramètres sauvegardés avec succès');
      showSuccess('Paramètres sauvegardés avec succès !');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setLoading(false);
    }
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
      showWarning("Tous les champs sont requis");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showWarning("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showWarning("Les nouveaux mots de passe ne correspondent pas");
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
        showSuccess("Mot de passe mis à jour avec succès !");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setActiveSection('profil');
      } else {
        const error = await response.json();
        showError("Erreur: " + error.message);
      }
    } catch (error) {
      showError("Erreur: " + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Vérifier la taille du fichier (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          showWarning("La photo ne doit pas dépasser 5MB");
          return;
        }

        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          showWarning("Format non supporté. Utilisez JPG, PNG ou WEBP");
          return;
        }

        // Uploader la photo
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload/profile-photo', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        
        const result = await response.json();
        
        // Mettre à jour l'état local
        setFormData(prev => ({
          ...prev,
          photoProfil: result.url
        }));
        
        // Sauvegarder dans la base de données
        await supabase
          .from('pro_profiles')
          .update({ photo_profil: result.url })
          .eq('user_id', session?.user?.id);
        
        showSuccess("Photo de profil mise à jour avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        showError("Erreur lors de l'upload de la photo: " + error.message);
      }
    }
  };

  const handlePhotoRemove = async () => {
    try {
      // Supprimer de la base de données
      await supabase
        .from('pro_profiles')
        .update({ photo_profil: null })
        .eq('user_id', session?.user?.id);
      
      // Mettre à jour l'état local
      setFormData(prev => ({
        ...prev,
        photoProfil: ""
      }));
      
      showSuccess("Photo de profil supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showError("Erreur lors de la suppression de la photo");
    }
  };

  const sections = [
    { id: 'profil', label: 'Profil', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'disponibilites', label: 'Disponibilités', icon: <ClockIcon className="w-5 h-5" /> },
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
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #F86F4D;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #F86F4D;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-webkit-slider-track {
          background: #1B263B;
          height: 8px;
          border-radius: 4px;
        }
        .slider::-moz-range-track {
          background: #1B263B;
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
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
                      <AddressAutocomplete
                        value={formData.pointGeographique}
                        onChange={(value) => handleInputChange('pointGeographique', value)}
                        onSelect={(address) => handleInputChange('pointGeographique', address)}
                        placeholder="Ex: 123 Rue de la Paix, 69001 Lyon"
                        className="w-full px-3 py-2 pl-10 text-sm"
                        disabled={!isEditing}
                      />
                      <MapPinIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-[#1B263B]/60 mt-1">
                      Adresse complète qui servira de point de départ pour votre rayon d'intervention
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">
                      Rayon d'intervention : {formData.rayonIntervention} km *
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={formData.rayonIntervention}
                      onChange={(e) => handleInputChange('rayonIntervention', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="w-full h-2 bg-[#1B263B]/20 rounded-lg appearance-none cursor-pointer slider disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        background: `linear-gradient(to right, #F86F4D 0%, #F86F4D ${((formData.rayonIntervention - 5) / (200 - 5)) * 100}%, #1B263B20 ${((formData.rayonIntervention - 5) / (200 - 5)) * 100}%, #1B263B20 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-[#1B263B]/60 mt-1">
                      <span>5 km</span>
                      <span>200 km</span>
                    </div>
                    <p className="text-xs text-[#1B263B]/60 mt-1">
                      Distance maximale depuis votre point de référence
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Années d'expérience</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    <p className="text-xs text-[#1B263B]/60 mt-1">
                      Nombre d'années d'expérience dans votre domaine
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1B263B]/70 mb-2">Durée des consultations</label>
                    <select
                      value={formData.dureeConsultation}
                      onChange={(e) => handleInputChange('dureeConsultation', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 heure</option>
                      <option value={90}>1h30</option>
                      <option value={120}>2 heures</option>
                    </select>
                    <p className="text-xs text-[#1B263B]/60 mt-1">
                      Durée standard de vos consultations
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

            {/* Section Disponibilités */}
            {activeSection === 'disponibilites' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#1B263B]">Gestion des disponibilités</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-3 py-2 text-[#F86F4D] border border-[#F86F4D] rounded-lg hover:bg-[#F86F4D]/10 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{isEditing ? 'Annuler' : 'Modifier'}</span>
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-[#1B263B]/70 mb-4">
                    Définissez vos créneaux de disponibilité pour chaque jour de la semaine. 
                    Les propriétaires pourront réserver des créneaux uniquement pendant vos heures de disponibilité.
                  </p>
                </div>

                <div className="space-y-4">
                  {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((jour) => {
                    const creneaux = formData.disponibilites[jour as keyof typeof formData.disponibilites];
                    return (
                    <div key={jour} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-[#1B263B] capitalize">
                          {jour === 'lundi' ? 'Lundi' :
                           jour === 'mardi' ? 'Mardi' :
                           jour === 'mercredi' ? 'Mercredi' :
                           jour === 'jeudi' ? 'Jeudi' :
                           jour === 'vendredi' ? 'Vendredi' :
                           jour === 'samedi' ? 'Samedi' :
                           'Dimanche'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={creneaux.matin || creneaux.apresMidi || creneaux.soir}
                              onChange={(e) => {
                                const newValue = e.target.checked;
                                handleInputChange('disponibilites', {
                                  ...formData.disponibilites,
                                  [jour]: {
                                    matin: newValue,
                                    apresMidi: newValue,
                                    soir: newValue
                                  }
                                });
                              }}
                              disabled={!isEditing}
                              className="h-4 w-4 text-[#F86F4D] focus:ring-[#F86F4D] border-[#1B263B]/20 rounded"
                            />
                            <span className="text-sm text-[#1B263B]/70">Toute la journée</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={creneaux.matin}
                            onChange={(e) => handleInputChange('disponibilites', {
                              ...formData.disponibilites,
                              [jour]: {
                                ...creneaux,
                                matin: e.target.checked
                              }
                            })}
                            disabled={!isEditing}
                            className="h-4 w-4 text-[#F86F4D] focus:ring-[#F86F4D] border-[#1B263B]/20 rounded"
                          />
                          <span className="text-sm text-[#1B263B]/70">Matin (8h-12h)</span>
                        </label>
                        
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={creneaux.apresMidi}
                            onChange={(e) => handleInputChange('disponibilites', {
                              ...formData.disponibilites,
                              [jour]: {
                                ...creneaux,
                                apresMidi: e.target.checked
                              }
                            })}
                            disabled={!isEditing}
                            className="h-4 w-4 text-[#F86F4D] focus:ring-[#F86F4D] border-[#1B263B]/20 rounded"
                          />
                          <span className="text-sm text-[#1B263B]/70">Après-midi (14h-18h)</span>
                        </label>
                        
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={creneaux.soir}
                            onChange={(e) => handleInputChange('disponibilites', {
                              ...formData.disponibilites,
                              [jour]: {
                                ...creneaux,
                                soir: e.target.checked
                              }
                            })}
                            disabled={!isEditing}
                            className="h-4 w-4 text-[#F86F4D] focus:ring-[#F86F4D] border-[#1B263B]/20 rounded"
                          />
                          <span className="text-sm text-[#1B263B]/70">Soir (18h-20h)</span>
                        </label>
                      </div>
                    </div>
                    );
                  })}
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
                      Ces actions sont irréversibles et supprimeront définitivement votre compte.
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
        userRole={session?.user?.role || "PROFESSIONNEL"}
      />

      {/* Toast notifications */}
      <SimpleToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
    </>
  );
}
