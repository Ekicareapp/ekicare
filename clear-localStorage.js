// Script pour nettoyer localStorage
const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ekicare_demandes');
    console.log('✅ localStorage nettoyé');
  } else {
    console.log('⚠️ Pas dans un environnement navigateur');
  }
};

console.log('📝 Pour nettoyer localStorage, ouvrez la console du navigateur et exécutez:');
console.log('clearLocalStorage()');

