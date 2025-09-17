"use client";

import { useState } from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function CreateTablesButton() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTables = async () => {
    if (!confirm('Êtes-vous sûr de vouloir créer les tables demandes et rendez_vous dans Supabase ?')) {
      return;
    }

    setIsCreating(true);

    try {
      console.log('🏗️ Création des tables...');
      const response = await fetch('/api/admin/create-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création des tables');
      }

      const result = await response.json();
      console.log('✅ Tables créées:', result.message);
      console.log('📊 Statut:', result);

      alert(`🏗️ CRÉATION DES TABLES TERMINÉE !\n\n✅ Message: ${result.message}\n📋 Table demandes: ${result.demandes}\n📅 Table rendez_vous: ${result.rendez_vous}\n\nRechargez la page pour voir les changements.`);
      
    } catch (error) {
      console.error('Erreur lors de la création des tables:', error);
      alert('❌ Erreur lors de la création des tables');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreateTables}
      disabled={isCreating}
      className="fixed bottom-20 right-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
      title="Créer les tables dans Supabase"
    >
      <WrenchScrewdriverIcon className="w-5 h-5" />
    </button>
  );
}
