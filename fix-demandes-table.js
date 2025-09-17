// Script pour créer la table demandes via l'API Next.js
const fetch = require('node-fetch');

async function createDemandesTable() {
  try {
    console.log('🔄 Création de la table demandes via API...');

    // D'abord, on va essayer de se connecter pour obtenir une session
    const loginResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await loginResponse.json();
    
    console.log('🔑 CSRF token obtenu');

    // Créer la table via l'API admin
    const createResponse = await fetch('http://localhost:3000/api/admin/create-tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.csrfToken
      }
    });

    const result = await createResponse.json();
    console.log('📋 Résultat de la création:', result);

    if (result.success) {
      console.log('✅ Table demandes créée avec succès !');
    } else {
      console.log('❌ Erreur lors de la création:', result.error);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

createDemandesTable();
