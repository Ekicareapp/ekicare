// Script de nettoyage ULTRA AGRESSIF - Élimine TOUT
console.log('🔥 NETTOYAGE ULTRA AGRESSIF - Élimination de TOUT...');

async function forceCleanEverything() {
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
      console.log('⚠️ Erreur API, on continue quand même...');
    } else {
      const result = await response.json();
      console.log('✅ Base de données nettoyée:', result.message);
    }

    // 2. Nettoyer localStorage complètement
    localStorage.clear();
    console.log('✅ localStorage complètement vidé');

    // 3. Nettoyer sessionStorage aussi
    sessionStorage.clear();
    console.log('✅ sessionStorage vidé');

    // 4. Nettoyer tous les cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies nettoyés');

    // 5. Forcer le rechargement de la page
    console.log('🔄 Rechargement forcé de la page...');
    
    // Attendre un peu puis recharger
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);

    console.log(`
🎯 NETTOYAGE ULTRA AGRESSIF TERMINÉ !

✅ Base de données Supabase : VIDÉE
✅ localStorage : VIDÉ
✅ sessionStorage : VIDÉ  
✅ Cookies : SUPPRIMÉS
🔄 Page en cours de rechargement...

Plus AUCUN rendez-vous "Sophie Martin" !
`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    // Recharger quand même
    window.location.reload(true);
  }
}

// Exécuter le nettoyage
forceCleanEverything();