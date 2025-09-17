console.log('🧪 Test de l\'API Google Places...');

// Test de géocodage
async function testGeocoding() {
  try {
    const response = await fetch('http://localhost:3000/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: '123 rue de la Paix, Paris, France'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Geocoding fonctionne !');
      console.log('📍 Adresse testée: 123 rue de la Paix, Paris');
      console.log('🌍 Coordonnées:', data.coordinates);
    } else {
      console.log('❌ Erreur API Geocoding:', data.error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

// Test de l'autocomplétion
async function testAutocomplete() {
  try {
    const response = await fetch('http://localhost:3000/api/places/autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: 'Paris'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Autocomplete fonctionne !');
      console.log('🔍 Recherche testée: "Paris"');
      console.log('📋 Résultats:', data.predictions?.length || 0, 'suggestions');
    } else {
      console.log('❌ Erreur API Autocomplete:', data.error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

// Lancer les tests
console.log('\n🚀 Lancement des tests...\n');
testGeocoding();
testAutocomplete();

console.log('\n📝 Note:');
console.log('Si vous voyez des erreurs, vérifiez que:');
console.log('1. Votre clé API Google Places est correcte');
console.log('2. Les APIs Geocoding et Places sont activées');
console.log('3. Les restrictions de domaine incluent localhost:3000');

