"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddressAutocomplete from "../../components/ui/AddressAutocomplete";

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    role: "",
        nom: "",
        prenom: "",
        telephone: "",
    ville: "",
          adresse: "",
          codePostal: "",
          pays: "France",
    profession: "",
    villeReference: "",
    villeReferenceCoords: null,
    rayonExercice: 50,
    description: "",
    siret: "",
    justificatif: null,
    photoProfil: null,
    photoProfilUrl: null,
  });

  const [errors, setErrors] = useState({});

  const uploadProfilePhoto = async (file) => {
    try {
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
      return result.url;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Name validation
    if (!formData.nom) {
      newErrors.nom = "Le nom est requis";
    }
    if (!formData.prenom) {
      newErrors.prenom = "Le prénom est requis";
    }

    // Phone validation
    if (!formData.telephone) {
      newErrors.telephone = "Le téléphone est requis";
    }

    // Location validation (only for proprio)
    if (formData.role === "proprio" && !formData.ville) {
      newErrors.ville = "La ville est requise";
    }

    // Role-specific validation
    if (formData.role === "pro") {
      if (!formData.profession) {
        newErrors.profession = "La profession est requise";
      }
      if (!formData.villeReference) {
        newErrors.villeReference = "La ville de référence d'exercice est requise";
      }
      if (!formData.description) {
        newErrors.description = "La description de votre activité est requise";
      } else if (formData.description.length < 50) {
        newErrors.description = "La description doit contenir au moins 50 caractères";
      }
      if (!formData.siret) {
        newErrors.siret = "Le numéro SIRET est requis";
      } else if (!/^\d{14}$/.test(formData.siret)) {
        newErrors.siret = "Le numéro SIRET doit contenir exactement 14 chiffres";
      }
      if (!formData.justificatif) {
        newErrors.justificatif = "Le justificatif de profession est requis";
      }
      // Validation photo de profil (facultative)
      if (formData.photoProfil) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (formData.photoProfil.size > maxSize) {
          newErrors.photoProfil = "La photo ne doit pas dépasser 5MB";
        }
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(formData.photoProfil.type)) {
          newErrors.photoProfil = "Format non supporté. Utilisez JPG, PNG ou WEBP";
        }
      }
    } else if (formData.role === "proprio") {
      if (!formData.adresse) {
        newErrors.adresse = "L'adresse est requise";
      }
      if (!formData.codePostal) {
        newErrors.codePostal = "Le code postal est requis";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("handleSubmit appelé !");
    console.log("Données du formulaire:", formData);
    
    if (!validateForm()) {
      console.log("Validation échouée");
      return;
    }

    console.log("Validation réussie, envoi des données...");
    setIsSubmitting(true);
    
    try {
      // Uploader la photo de profil si elle existe
      let photoProfilUrl = null;
      if (formData.photoProfil) {
        console.log("Upload de la photo de profil...");
        photoProfilUrl = await uploadProfilePhoto(formData.photoProfil);
        console.log("Photo uploadée:", photoProfilUrl);
      }

      const requestData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        ville: formData.ville,
        adresse: formData.adresse,
        codePostal: formData.codePostal,
        pays: formData.pays,
        profession: formData.profession,
        villeReference: formData.villeReference,
        rayonExercice: formData.rayonExercice,
        description: formData.description,
        siret: formData.siret,
        justificatif: formData.justificatif ? formData.justificatif.name : null,
        photoProfil: photoProfilUrl
      };
      
      console.log("Données envoyées:", requestData);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Statut de la réponse:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("Erreur API:", error);
        throw new Error(error.message || "Erreur lors de la création du compte");
      }

      const result = await response.json();
      console.log("Résultat de l'API:", result);

      // Stocker les informations de confirmation
      localStorage.setItem("confirmation_name", result.user.name);
      localStorage.setItem("confirmation_email", result.user.email);
      localStorage.setItem("confirmation_role", result.user.role);

      // Rediriger vers la page de confirmation
      router.push("/confirmation");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la création du compte");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F2] to-[#F0F0F0]">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-r from-[#F86F4D] to-[#FF8A65] flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1B263B] mb-2">
            Créer mon compte Ekicare
          </h1>
          <p className="text-lg text-[#1B263B]/70">
            Rejoignez la communauté des professionnels et propriétaires d'équidés
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs de base */}
            <div className="space-y-4">
              {/* Field 1: Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1B263B] mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

              {/* Field 2: Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1B263B] mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                  placeholder="Votre mot de passe"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

              {/* Field 3: Confirmer mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1B263B] mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                  placeholder="Confirmez votre mot de passe"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>

              {/* Field 4: Choix du rôle */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[#1B263B] mb-2">
                  Type de compte *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                >
                  <option value="">Sélectionnez votre type de compte</option>
                  <option value="proprio">Propriétaire d'équidés</option>
                  <option value="pro">Professionnel de santé équine</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
              </div>
            </div>

            {/* Champs conditionnels selon le rôle */}
            {formData.role && (
              <div className="space-y-4 border-t border-[#1B263B]/10 pt-6">
                <h3 className="text-lg font-semibold text-[#1B263B]">
                  {formData.role === "pro" ? "Informations professionnelles" : "Informations personnelles"}
                </h3>
                
                {/* Champs communs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-[#1B263B] mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                      placeholder="Votre nom"
                    />
                    {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                  </div>

                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-[#1B263B] mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                      placeholder="Votre prénom"
                    />
                    {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-[#1B263B] mb-2">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                    placeholder="06 12 34 56 78"
                  />
                  {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
                </div>

                {/* Champs spécifiques au professionnel */}
                {formData.role === "pro" && (
                  <>
                    {/* Photo de profil - Facultative */}
                    <div>
                      <label htmlFor="photoProfil" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Photo de profil (facultative)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#1B263B]/20 rounded-lg hover:border-[#F86F4D]/40 transition-colors">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-[#1B263B]/40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-[#1B263B]/60">
                            <label htmlFor="photoProfil" className="relative cursor-pointer bg-white rounded-md font-medium text-[#F86F4D] hover:text-[#F86F4D]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#F86F4D]">
                              <span>Télécharger une photo</span>
                              <input
                                id="photoProfil"
                                name="photoProfil"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">ou glissez-déposez ici</p>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">
                            JPG, PNG, WEBP jusqu'à 5MB
                          </p>
                        </div>
                      </div>
                      {formData.photoProfil && (
                        <div className="mt-3 flex items-center justify-center">
                          <div className="flex items-center space-x-3">
                            <img
                              src={URL.createObjectURL(formData.photoProfil)}
                              alt="Aperçu de la photo de profil"
                              className="h-16 w-16 rounded-full object-cover border-2 border-[#F86F4D]/20"
                            />
                            <div className="text-sm text-green-600">
                              ✓ Photo sélectionnée : {formData.photoProfil.name}
                            </div>
                          </div>
                        </div>
                      )}
                      {errors.photoProfil && <p className="mt-1 text-sm text-red-600">{errors.photoProfil}</p>}
                    </div>

                    <div>
                      <label htmlFor="profession" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Profession *
                      </label>
                      <select
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                      >
                        <option value="">Sélectionnez votre profession</option>
                        <option value="Vétérinaire équin">Vétérinaire équin</option>
                        <option value="Maréchal-ferrant">Maréchal-ferrant</option>
                        <option value="Ostéopathe équin">Ostéopathe équin</option>
                        <option value="Dentiste équin">Dentiste équin</option>
                        <option value="Physiothérapeute équin">Physiothérapeute équin</option>
                        <option value="Comportementaliste équin">Comportementaliste équin</option>
                        <option value="Éducateur équin">Éducateur équin</option>
                        <option value="Autre">Autre</option>
                      </select>
                      {errors.profession && <p className="mt-1 text-sm text-red-600">{errors.profession}</p>}
                    </div>

                    <div>
                      <label htmlFor="villeReference" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Ville de référence d'exercice *
                      </label>
                      <AddressAutocomplete
                        value={formData.villeReference}
                        onChange={(value) => setFormData(prev => ({ ...prev, villeReference: value }))}
                        onSelect={(address, coordinates) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            villeReference: address,
                            villeReferenceCoords: coordinates
                          }));
                        }}
                        placeholder="Commencez à taper votre ville..."
                        className="w-full px-4 py-3"
                        required
                      />
                      <p className="mt-1 text-xs text-[#1B263B]/60">
                        🔍 Autocomplétion Google activée - Géolocalisation automatique
                      </p>
                      {errors.villeReference && <p className="mt-1 text-sm text-red-600">{errors.villeReference}</p>}
                    </div>

                    <div>
                      <label htmlFor="rayonExercice" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Rayon d'exercice : {formData.rayonExercice} km *
                      </label>
                      <input
                        type="range"
                        id="rayonExercice"
                        name="rayonExercice"
                        min="5"
                        max="200"
                        step="5"
                        value={formData.rayonExercice}
                        onChange={handleChange}
                        className="w-full h-2 bg-[#1B263B]/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-[#1B263B]/60 mt-1">
                        <span>5 km</span>
                        <span>200 km</span>
                      </div>
                      {errors.rayonExercice && <p className="mt-1 text-sm text-red-600">{errors.rayonExercice}</p>}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Description de votre activité *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors resize-none"
                        placeholder="Décrivez votre activité, vos spécialités, votre expérience..."
                      />
                      <div className="flex justify-between text-xs text-[#1B263B]/60 mt-1">
                        <span>Maximum 500 caractères</span>
                        <span>{formData.description.length}/500</span>
                      </div>
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                      <label htmlFor="siret" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Numéro SIRET *
                      </label>
                      <input
                        type="text"
                        id="siret"
                        name="siret"
                        value={formData.siret}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                        placeholder="12345678901234"
                        maxLength={14}
                      />
                      <p className="mt-1 text-xs text-[#1B263B]/60">
                        14 chiffres (sans espaces ni tirets)
                      </p>
                      {errors.siret && <p className="mt-1 text-sm text-red-600">{errors.siret}</p>}
                    </div>

                    <div>
                      <label htmlFor="justificatif" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Justificatif de profession *
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#1B263B]/20 rounded-lg hover:border-[#F86F4D]/40 transition-colors">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-[#1B263B]/40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-[#1B263B]/60">
                            <label htmlFor="justificatif" className="relative cursor-pointer bg-white rounded-md font-medium text-[#F86F4D] hover:text-[#F86F4D]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#F86F4D]">
                              <span>Télécharger un fichier</span>
                              <input
                                id="justificatif"
                                name="justificatif"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">ou glissez-déposez ici</p>
                          </div>
                          <p className="text-xs text-[#1B263B]/60">
                            PDF, PNG, JPG jusqu'à 10MB
                          </p>
                        </div>
                      </div>
                      {formData.justificatif && (
                        <p className="mt-2 text-sm text-green-600">
                          ✓ Fichier sélectionné : {formData.justificatif.name}
                        </p>
                      )}
                      {errors.justificatif && <p className="mt-1 text-sm text-red-600">{errors.justificatif}</p>}
                    </div>
                  </>
                )}

                {/* Champs spécifiques au propriétaire */}
                {formData.role === "proprio" && (
                  <>
                    <div>
                      <label htmlFor="adresse" className="block text-sm font-medium text-[#1B263B] mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                        placeholder="123 rue de la Paix"
                      />
                      {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="codePostal" className="block text-sm font-medium text-[#1B263B] mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          id="codePostal"
                          name="codePostal"
                          value={formData.codePostal}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                          placeholder="75001"
                        />
                        {errors.codePostal && <p className="mt-1 text-sm text-red-600">{errors.codePostal}</p>}
                      </div>

                      <div>
                        <label htmlFor="ville" className="block text-sm font-medium text-[#1B263B] mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          id="ville"
                          name="ville"
                          value={formData.ville}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#1B263B]/20 rounded-lg focus:ring-2 focus:ring-[#F86F4D]/20 focus:border-[#F86F4D] transition-colors"
                          placeholder="Paris"
                        />
                        {errors.ville && <p className="mt-1 text-sm text-red-600">{errors.ville}</p>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={async () => {
                  // Créer le compte directement, sans validation complexe
                  setIsSubmitting(true);
                  
                  try {
                    // Uploader la photo de profil si elle existe
                    let photoProfilUrl = null;
                    if (formData.photoProfil) {
                      console.log("Upload de la photo de profil...");
                      photoProfilUrl = await uploadProfilePhoto(formData.photoProfil);
                      console.log("Photo uploadée:", photoProfilUrl);
                    }

                    const response = await fetch("/api/auth/register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        role: formData.role,
                        nom: formData.nom,
                        prenom: formData.prenom,
                        telephone: formData.telephone,
                        ville: formData.ville,
                        adresse: formData.adresse,
                        codePostal: formData.codePostal,
                        pays: formData.pays,
                        profession: formData.profession,
                        villeReference: formData.villeReference,
                        rayonExercice: formData.rayonExercice,
                        description: formData.description,
                        siret: formData.siret,
                        justificatif: formData.justificatif ? formData.justificatif.name : null,
                        photoProfil: photoProfilUrl
                      })
                    });

                    if (response.ok) {
                      // Stocker les infos pour la page de confirmation
                      localStorage.setItem("confirmation_name", `${formData.prenom} ${formData.nom}`);
                      localStorage.setItem("confirmation_email", formData.email);
                      localStorage.setItem("confirmation_role", formData.role);
                      
                      // Redirection vers la page de confirmation
                      window.location.href = "/confirmation";
                    } else {
                      const error = await response.json();
                      alert("❌ Erreur: " + error.message);
                    }
                  } catch (error) {
                    alert("❌ Erreur: " + error.message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  backgroundColor: isSubmitting ? "#1B263B" : "#F86F4D",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? "Création du compte..." : "Créer mon compte"}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-[#1B263B]/70">
                Déjà un compte ?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#F86F4D] hover:text-[#F86F4D]/80 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}