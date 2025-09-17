console.log('🧪 Test de la sélection de date et créneau...');

// Test 1: Vérifier l'API des disponibilités
fetch('http://localhost:3001/api/professionnels/1ad6a1b7-0632-421a-af23-51bbaf9e4280/disponibilites')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API disponibilités fonctionne');
    console.log('📊 Durée de consultation:', data.dureeConsultation, 'minutes');
    console.log('📅 Disponibilités:', data.disponibilites);
    
    // Test de génération de créneaux
    const testDate = '2024-01-15'; // Lundi
    const dateObj = new Date(testDate);
    const jours = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const jour = jours[dateObj.getDay()];
    
    console.log(`\n🔍 Test pour le ${jour} (${testDate}):`);
    
    if (data.disponibilites[jour]) {
      const jourDispo = data.disponibilites[jour];
      console.log('📋 Disponibilités du jour:', jourDispo);
      
      // Générer des créneaux de test
      const creneaux = [];
      const duree = data.dureeConsultation;
      
      if (jourDispo.matin) {
        for (let heure = 8; heure < 12; heure += duree / 60) {
          const heureStr = `${Math.floor(heure).toString().padStart(2, '0')}:${((heure % 1) * 60).toString().padStart(2, '0')}`;
          creneaux.push(heureStr);
        }
      }
      
      if (jourDispo.apresMidi) {
        for (let heure = 14; heure < 18; heure += duree / 60) {
          const heureStr = `${Math.floor(heure).toString().padStart(2, '0')}:${((heure % 1) * 60).toString().padStart(2, '0')}`;
          creneaux.push(heureStr);
        }
      }
      
      console.log('⏰ Créneaux générés:', creneaux);
    }
  })
  .catch(error => {
    console.log('❌ Erreur API disponibilités:', error.message);
  });

console.log('\n🎯 Instructions pour tester manuellement:');
console.log('1. Allez sur http://localhost:3001/dashboard/proprio/rechercher');
console.log('2. Connectez-vous avec un compte propriétaire');
console.log('3. Recherchez des professionnels');
console.log('4. Cliquez sur "Prendre rendez-vous"');
console.log('5. Sélectionnez une date');
console.log('6. Vérifiez que les créneaux s\'affichent correctement');
console.log('7. Sélectionnez un créneau');
console.log('8. Vérifiez que le formulaire se valide correctement');

