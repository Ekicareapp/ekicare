"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface Equide {
  id: string;
  user_id: string;
  nom: string;
  age: number;
  race: string;
  couleur: string;
  sexe: "male" | "female";
  taille: number;
  poids: number;
  date_naissance: string;
  proprietaire: string;
  veterinaire: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export default function ProprioEquides() {
  const { data: session } = useSession();
  const [equides, setEquides] = useState<Equide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquide, setEditingEquide] = useState<Equide | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [equideToDelete, setEquideToDelete] = useState<Equide | null>(null);
  const [formData, setFormData] = useState<Partial<Equide>>({});
  const [saving, setSaving] = useState(false);

  // Charger les équidés depuis l'API
  useEffect(() => {
    const loadEquides = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/proprio/equides`);
        if (response.ok) {
          const data = await response.json();
          // Convertir le sexe de la base vers l'affichage
          const equidesAvecSexeConverti = (data.equides || []).map((equide: any) => ({
            ...equide,
            sexe: equide.sexe === "male" ? "male" : equide.sexe === "female" ? "female" : "male"
          }));
          setEquides(equidesAvecSexeConverti);
        } else {
          console.error("Erreur lors du chargement des équidés");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des équidés:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEquides();
  }, [session]);

  const handleAddEquide = () => {
    setEditingEquide(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEditEquide = (equide: Equide) => {
    setEditingEquide(equide);
    setFormData(equide);
    setIsModalOpen(true);
  };

  const handleDeleteEquide = (equide: Equide) => {
    setEquideToDelete(equide);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!equideToDelete) return;

    try {
      const response = await fetch(`/api/equides?id=${equideToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEquides(prev => prev.filter(e => e.id !== equideToDelete.id));
        setShowDeleteConfirm(false);
        setEquideToDelete(null);
      } else {
        const error = await response.json();
        alert("Erreur: " + error.message);
      }
    } catch (error) {
      console.error("Erreur suppression équidé:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setEquideToDelete(null);
  };

  const handleSaveEquide = async () => {
    if (!session?.user?.id) {
      alert("Erreur: Utilisateur non connecté");
      return;
    }

    // Validation basique
    if (!formData.sexe) {
      alert("Veuillez sélectionner un sexe");
      return;
    }

    setSaving(true);
    try {
      const equideData = {
        nom: formData.nom,
        race: formData.race,
        couleur: formData.couleur,
        sexe: formData.sexe,
        taille: formData.taille || 0,
        poids: formData.poids || 0,
        dateNaissance: formData.date_naissance,
        proprietaire: session.user.email || "Propriétaire",
        veterinaire: formData.veterinaire || "",
        notes: formData.notes || "",
        userId: session.user.id
      };

      console.log("Données envoyées à l'API:", equideData);
      console.log("Sexe envoyé:", formData.sexe);

      let response;
      if (editingEquide) {
        // Modifier un équidé existant
        response = await fetch('/api/equides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingEquide.id,
            ...equideData
          })
        });
      } else {
        // Créer un nouvel équidé
        response = await fetch('/api/equides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(equideData)
        });
      }

      if (response.ok) {
        const data = await response.json();
        
        if (editingEquide) {
          // Mettre à jour l'équidé dans la liste
          setEquides(prev => prev.map(e => 
            e.id === editingEquide.id ? data.equide : e
          ));
        } else {
          // Ajouter le nouvel équidé à la liste
          setEquides(prev => [data.equide, ...prev]);
        }
        
        setIsModalOpen(false);
        setFormData({});
      } else {
        const error = await response.json();
        alert("Erreur: " + error.message);
      }
    } catch (error) {
      console.error("Erreur sauvegarde équidé:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Equide, value: string | number) => {
    // Conversion spéciale pour la date de naissance
    if (field === 'date_naissance' && typeof value === 'string') {
      // Si l'utilisateur entre une date au format DD/MM/YYYY, la convertir en YYYY-MM-DD
      if (value.includes('/')) {
        const parts = value.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          console.log(`Date convertie: ${value}`);
        }
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-[#1B263B]/10 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg border border-[#1B263B]/10 p-4">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B263B] mb-2">
              Mes Équidés
            </h1>
            <p className="text-sm sm:text-base text-[#1B263B]/70">
              Gérez les informations de vos équidés.
            </p>
          </div>
          <button
            onClick={handleAddEquide}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F86F4D] hover:bg-[#F86F4D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F86F4D] transition-colors w-full sm:w-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un équidé
          </button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Total équidés</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{equides.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Mâles</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{equides.filter(e => e.sexe === "male").length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Femelles</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{equides.filter(e => e.sexe === "female").length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-4 border border-[#1B263B]/10">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-[#1B263B]/70">Enregistrés</p>
              <p className="text-lg sm:text-2xl font-bold text-[#1B263B]">{equides.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Liste des équidés */}
      {equides.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1B263B] mb-2">
            Aucun équidé enregistré
          </h3>
          <p className="text-[#1B263B]/70 mb-6">
            Commencez par ajouter votre premier équidé.
          </p>
          <button
            onClick={handleAddEquide}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F86F4D] hover:bg-[#F86F4D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F86F4D] transition-all duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un équidé
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {equides.map((equide, index) => (
            <motion.div
              key={equide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-lg p-4 sm:p-6 border border-[#1B263B]/10 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#1B263B] mb-1">
                    {equide.nom}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1B263B]/70">
                    {equide.race} • {equide.couleur}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditEquide(equide)}
                    className="p-2 text-[#1B263B]/70 hover:text-[#F86F4D] hover:bg-[#F86F4D]/10 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteEquide(equide)}
                    className="p-2 text-[#1B263B]/70 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium text-[#1B263B]/70">Âge:</span>
                    <span className="ml-1 text-[#1B263B]">{equide.age} ans</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#1B263B]/70">Sexe:</span>
                    <span className="ml-1 text-[#1B263B]">{equide.sexe === "male" ? "Mâle" : equide.sexe === "female" ? "Femelle" : "Mâle"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#1B263B]/70">Taille:</span>
                    <span className="ml-1 text-[#1B263B]">{equide.taille} cm</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#1B263B]/70">Poids:</span>
                    <span className="ml-1 text-[#1B263B]">{equide.poids} kg</span>
                  </div>
                </div>

                {equide.notes && (
                  <div className="pt-3 border-t border-[#1B263B]/10">
                    <p className="text-sm text-[#1B263B]/70 italic">
                      "{equide.notes}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal d'ajout/modification */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1B263B]">
                  {editingEquide ? "Modifier l'équidé" : "Ajouter un équidé"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#1B263B]/70 hover:text-[#1B263B] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.nom || ""}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Nom de l'équidé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Race *
                  </label>
                  <input
                    type="text"
                    value={formData.race || ""}
                    onChange={(e) => handleInputChange("race", e.target.value)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Race de l'équidé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Couleur *
                  </label>
                  <input
                    type="text"
                    value={formData.couleur || ""}
                    onChange={(e) => handleInputChange("couleur", e.target.value)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Couleur de l'équidé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Sexe *
                  </label>
                  <select
                    value={formData.sexe || ""}
                    onChange={(e) => handleInputChange("sexe", e.target.value)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                  >
                    <option value="">Sélectionner un sexe</option>
                    <option value="male">Mâle</option>
                    <option value="female">Femelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    value={formData.date_naissance || ""}
                    onChange={(e) => handleInputChange("date_naissance", e.target.value)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Taille (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.taille || ""}
                    onChange={(e) => handleInputChange("taille", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Taille en cm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.poids || ""}
                    onChange={(e) => handleInputChange("poids", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Poids en kg"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Vétérinaire référent
                  </label>
                  <input
                    type="text"
                    value={formData.veterinaire || ""}
                    onChange={(e) => handleInputChange("veterinaire", e.target.value)}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Nom du vétérinaire référent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#1B263B] mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#1B263B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86F4D] focus:border-transparent"
                    placeholder="Notes sur l'équidé..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#1B263B] bg-white border border-[#1B263B]/20 rounded-md hover:bg-[#1B263B]/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEquide}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#F86F4D] rounded-md hover:bg-[#F86F4D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {saving ? "Sauvegarde..." : (editingEquide ? "Modifier" : "Ajouter")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1B263B]">
                    Supprimer l'équidé
                  </h3>
                </div>
                
                <p className="text-[#1B263B]/70 mb-6">
                  Êtes-vous sûr de vouloir supprimer <strong>{equideToDelete?.nom}</strong> ? 
                  Cette action est irréversible.
                </p>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-sm font-medium text-[#1B263B] bg-white border border-[#1B263B]/20 rounded-md hover:bg-[#1B263B]/5 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#F86F4D] rounded-md hover:bg-[#F86F4D]/90 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
