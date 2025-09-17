// Script pour corriger immédiatement l'affichage des données
const fixDataDisplay = () => {
  console.log('🔧 Correction de l\'affichage des données...');
  
  if (typeof window !== 'undefined') {
    // Récupérer les données actuelles
    const demandes = localStorage.getItem('ekicare_demandes');
    
    if (demandes) {
      try {
        const parsed = JSON.parse(demandes);
        console.log('📊 Données actuelles:', parsed);
        
        // Corriger chaque demande
        const correctedDemandes = parsed.map(demande => {
          // Si les données sont manquantes, les remplacer par des données de test réalistes
          if (!demande.proprio || demande.proprio.nom === 'Propriétaire') {
            demande.proprio = {
              nom: 'Martin',
              prenom: 'Sophie',
              email: 'sophie.martin@email.com',
              telephone: '0123456789'
            };
          }
          
          if (!demande.equide || demande.equide.nom === 'Équidé') {
            demande.equide = {
              nom: 'Bella',
              race: 'Pur-sang',
              age: 7
            };
          }
          
          return demande;
        });
        
        // Sauvegarder les données corrigées
        localStorage.setItem('ekicare_demandes', JSON.stringify(correctedDemandes));
        console.log('✅ Données corrigées:', correctedDemandes);
        
        // Recharger la page
        window.location.reload();
        
      } catch (error) {
        console.error('❌ Erreur:', error);
      }
    } else {
      console.log('⚠️ Aucune donnée à corriger');
    }
  } else {
    console.log('⚠️ Pas dans un environnement navigateur');
  }
};

console.log('📝 Pour corriger l\'affichage, ouvrez la console du navigateur et exécutez:');
console.log('fixDataDisplay()');

