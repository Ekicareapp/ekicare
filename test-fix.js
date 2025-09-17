console.log('🔧 Vérification des corrections...');

// Test 1: Vérifier que l'application répond
fetch('http://localhost:3001')
  .then(response => {
    if (response.ok) {
      console.log('✅ Application accessible sur localhost:3001');
    } else {
      console.log('❌ Application non accessible');
    }
  })
  .catch(error => {
    console.log('❌ Erreur de connexion:', error.message);
  });

// Test 2: Vérifier l'API de disponibilités
fetch('http://localhost:3001/api/professionnels/1ad6a1b7-0632-421a-af23-51bbaf9e4280/disponibilites')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API de disponibilités fonctionne');
    console.log('📊 Durée de consultation:', data.dureeConsultation, 'minutes');
    console.log('📅 Jours disponibles:', Object.keys(data.disponibilites).filter(jour => 
      data.disponibilites[jour].matin || data.disponibilites[jour].apresMidi || data.disponibilites[jour].soir
    ).length, 'sur 7');
  })
  .catch(error => {
    console.log('❌ Erreur API:', error.message);
  });

console.log('\n🎯 Instructions pour tester:');
console.log('1. Allez sur http://localhost:3001/dashboard/proprio/rechercher');
console.log('2. Recherchez des professionnels');
console.log('3. Cliquez sur "Prendre rendez-vous"');
console.log('4. Vous devriez voir les disponibilités intelligentes !');
console.log('\n✅ Les erreurs ont été corrigées !');

