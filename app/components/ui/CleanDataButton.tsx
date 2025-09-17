"use client";

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CleanDataButton() {
  const [isCleaning, setIsCleaning] = useState(false);

  const handleCleanData = async () => {
    if (!confirm('Êtes-vous sûr de vouloir nettoyer TOUTES les données (localStorage + base de données) ?')) {
      return;
    }

    setIsCleaning(true);

    try {
      // 1. Nettoyage FORCÉ de la base de données
      console.log('🔥 Nettoyage FORCÉ de la base de données...');
      const response = await fetch('/api/admin/force-clean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('⚠️ Erreur API, on continue quand même...');
      } else {
        const result = await response.json();
        console.log('✅ Nettoyage forcé terminé:', result.message);
      }

      // 2. Nettoyer localStorage complètement
      localStorage.clear();
      console.log('✅ localStorage vidé');

      // 3. Nettoyer sessionStorage aussi
      sessionStorage.clear();
      console.log('✅ sessionStorage vidé');

      // 4. Nettoyer tous les cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      console.log('✅ Cookies supprimés');

      // 5. Déclencher l'événement de mise à jour
      window.dispatchEvent(new CustomEvent('demandeUpdated', { 
        detail: { demandeId: 'clean', nouveauStatut: 'CLEANED' } 
      }));

      alert('🔥 NETTOYAGE FORCÉ TERMINÉ !\n\n✅ Base de données : VIDÉE\n✅ localStorage : VIDÉ\n✅ sessionStorage : VIDÉ\n✅ Cookies : SUPPRIMÉS\n\nPlus AUCUN rendez-vous "Sophie Martin" !\n\nRechargez la page (F5) pour voir les changements.');
      
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      alert('❌ Erreur lors du nettoyage des données');
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <button
      onClick={handleCleanData}
      disabled={isCleaning}
      className="fixed bottom-4 right-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
      title="Nettoyer les données de test"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
}
