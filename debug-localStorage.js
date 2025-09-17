// Script pour déboguer les données dans localStorage
const debugLocalStorage = () => {
  console.log('🔍 Debug localStorage...');
  
  if (typeof window !== 'undefined') {
    const demandes = localStorage.getItem('ekicare_demandes');
    if (demandes) {
      try {
        const parsed = JSON.parse(demandes);
        console.log(`📊 ${parsed.length} demandes trouvées:`);
        parsed.forEach((demande, index) => {
          console.log(`${index + 1}. Structure complète:`, JSON.stringify(demande, null, 2));
        });
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
      }
    } else {
      console.log('⚠️ Aucune demande dans localStorage');
    }
  } else {
    console.log('⚠️ Pas dans un environnement navigateur');
  }
};

// Instructions pour l'utilisateur
console.log('📝 Pour déboguer localStorage, ouvrez la console du navigateur et exécutez:');
console.log('debugLocalStorage()');

