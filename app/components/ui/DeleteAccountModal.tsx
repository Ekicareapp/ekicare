"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export default function DeleteAccountModal({ isOpen, onClose, userRole }: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const router = useRouter();

  const expectedText = "SUPPRIMER MON COMPTE";
  const isConfirmationValid = confirmationText === expectedText;

  const handleDelete = async () => {
    if (!isConfirmationValid) return;

    setIsDeleting(true);
    
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la suppression du compte");
      }

      // Déconnexion et redirection
      await signOut({ callbackUrl: "/" });
      
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("❌ Erreur lors de la suppression du compte: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-md w-full border border-red-200 shadow-xl"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Supprimer le compte
              </h2>
              <p className="text-sm text-gray-500">
                Cette action est irréversible
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">
              ⚠️ Attention : Action irréversible
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Votre compte sera définitivement supprimé</li>
              <li>• Toutes vos données seront perdues</li>
              <li>• Cette action ne peut pas être annulée</li>
              {userRole === "PROFESSIONNEL" && (
                <li>• Votre profil professionnel sera supprimé</li>
              )}
              {userRole === "PROPRIETAIRE" && (
                <li>• Vos équidés et demandes seront supprimés</li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-3">
              Pour confirmer la suppression, tapez exactement :
            </p>
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <code className="text-sm font-mono text-gray-800">
                {expectedText}
              </code>
            </div>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Tapez le texte ci-dessus"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
            className="px-4 py-2 bg-[#F86F4D] text-white rounded-lg hover:bg-[#F86F4D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Suppression...
              </>
            ) : (
              "Supprimer définitivement"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
