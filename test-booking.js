// Test de la fonctionnalité de réservation
console.log('🧪 Test de la fonctionnalité de réservation...');

// Simuler une demande de rendez-vous
const testDemande = {
  proId: 'test-pro-id',
  date: '2024-01-20',
  heure: '14:00',
  description: 'Test de demande',
  adresse: 'Test adresse',
  equides: ['test-equide-id'],
  creneauxAlternatifs: []
};

console.log('📝 Données de test:', testDemande);

// Tester l'API de création
fetch('http://localhost:3001/api/demandes/rdv', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testDemande)
})
.then(response => response.json())
.then(data => {
  console.log('✅ Réponse création:', data);
  
  // Tester l'API de récupération
  return fetch('http://localhost:3001/api/demandes?role=proprio&proprioId=test-proprio-id');
})
.then(response => response.json())
.then(data => {
  console.log('✅ Réponse récupération:', data);
})
.catch(error => {
  console.error('❌ Erreur:', error);
});

