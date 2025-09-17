// Script de nettoyage COMPLET via l'API
console.log('🧹 Nettoyage COMPLET (localStorage + base de données)...');

async function cleanEverything() {
  try {
    // 1. Nettoyer la base de données via l'API
    console.log('🗄️ Nettoyage de la base de données Supabase...');
    const response = await fetch('/api/admin/clean-database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du nettoyage de la base de données');
    }

    const result = await response.json();
    console.log('✅ Base de données nettoyée:', result.message);

    // 2. Nettoyer localStorage complètement
    localStorage.clear();
    console.log('✅ localStorage complètement vidé');

    // 3. Créer une demande de test propre
    const testDemande = {
      id: `demande_${Date.now()}`,
      pro_id: 'test_pro_id',
      proprio_id: 'test_proprio_id',
      equide_id: 'test_equide_id',
      statut: 'EN_ATTENTE',
      type: 'consultation',
      date: new Date().toISOString(),
      adresse: '123 Rue Test, Ville Test',
      description: 'Test de consultation vétérinaire',
      creneaux_alternatifs: [],
      created_at: new Date().toISOString(),
      proprio: {
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@test.com',
        telephone: '0123456789'
      },
      equide: {
        nom: 'Bella',
        race: 'Pur-sang',
        age: 7
      },
      pro: {
        id: 'test_pro_id',
        nom: 'Dupont',
        prenom: 'Dr. Jean',
        profession: 'Vétérinaire'
      }
    };

    // 4. Ajouter UNIQUEMENT la demande de test
    localStorage.setItem('ekicare_demandes', JSON.stringify([testDemande]));

    console.log('✅ Demande de test créée:', testDemande);

    // 5. Déclencher l'événement de mise à jour
    window.dispatchEvent(new CustomEvent('demandeUpdated', { 
      detail: { demandeId: testDemande.id, nouveauStatut: 'EN_ATTENTE' } 
    }));

    console.log('✅ Événement de mise à jour déclenché');

    console.log(`
🎯 Instructions :

1. Rechargez la page (F5)
2. Allez sur "Mes rendez-vous" (onglet professionnel)
3. Vous devriez voir UNIQUEMENT "Sophie Martin - Bella" dans "Demandes"
4. Plus AUCUN rendez-vous dans "À venir" !

🧹 Nettoyage COMPLET terminé !
`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le nettoyage
cleanEverything();

