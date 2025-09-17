// Script pour nettoyer les anciennes données et tester
const clearAndTest = () => {
  console.log('🧹 Nettoyage des anciennes données...');
  
  if (typeof window !== 'undefined') {
    // Nettoyer localStorage
    localStorage.removeItem('ekicare_demandes');
    console.log('✅ localStorage nettoyé');
    
    // Vérifier qu'il est vide
    const demandes = localStorage.getItem('ekicare_demandes');
    console.log('📊 Demandes après nettoyage:', demandes);
    
    console.log('🔄 Maintenant, créez une nouvelle demande de rendez-vous pour tester');
  } else {
    console.log('⚠️ Pas dans un environnement navigateur');
  }
};

console.log('📝 Pour nettoyer et tester, ouvrez la console du navigateur et exécutez:');
console.log('clearAndTest()');

