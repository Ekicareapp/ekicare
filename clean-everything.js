// Script de nettoyage COMPLET - Élimine TOUT
console.log('🧹 NETTOYAGE COMPLET - Élimination de TOUT...');

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

    // 3. Nettoyer sessionStorage aussi
    sessionStorage.clear();
    console.log('✅ sessionStorage vidé');

    // 4. Nettoyer tous les cookies liés à l'app
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies nettoyés');

    console.log(`
🎯 NETTOYAGE COMPLET TERMINÉ !

✅ Base de données Supabase : VIDÉE
✅ localStorage : VIDÉ
✅ sessionStorage : VIDÉ  
✅ Cookies : SUPPRIMÉS

Maintenant :
1. Rechargez la page (F5)
2. Plus AUCUN rendez-vous "Sophie Martin" !
3. Plus AUCUNE donnée de test !

🧹 TOUT EST PROPRE !
`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le nettoyage
cleanEverything();

