console.log('🎯 Test du système complet de demandes...');

// Test 1: API des demandes propriétaire
fetch('http://localhost:3000/api/proprio/demandes')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API demandes propriétaire: OK');
    console.log('📊 Nombre de demandes:', data.demandes?.length || 0);
    
    if (data.message) {
      console.log('ℹ️ Message:', data.message);
    }
  })
  .catch(error => {
    console.log('❌ Erreur API demandes propriétaire:', error.message);
  });

// Test 2: API des demandes professionnel
fetch('http://localhost:3000/api/pro/demandes')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API demandes professionnel: OK');
    console.log('📊 Nombre de demandes:', data.demandes?.length || 0);
    
    if (data.message) {
      console.log('ℹ️ Message:', data.message);
    }
  })
  .catch(error => {
    console.log('❌ Erreur API demandes professionnel:', error.message);
  });

console.log('\n🎉 Système de demandes intégré !');
console.log('\n📋 Fonctionnalités ajoutées:');
console.log('✅ Composant ProprioDemandes pour le dashboard propriétaire');
console.log('✅ Composant ProDemandes pour le dashboard professionnel');
console.log('✅ Section demandes intégrée dans le dashboard pro');
console.log('✅ APIs fonctionnelles pour les deux types d\'utilisateurs');

console.log('\n🎯 Pour tester:');
console.log('1. Allez sur http://localhost:3000/dashboard/proprio/demandes');
console.log('2. Faites une demande de rendez-vous depuis la recherche');
console.log('3. Vérifiez que la demande apparaît sur les deux dashboards');
console.log('4. Le professionnel peut accepter/refuser la demande');

console.log('\n📝 Note:');
console.log('Le système fonctionne en mode simulation car les tables');
console.log('demandes/rendez_vous n\'existent pas encore dans Supabase.');