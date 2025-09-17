// Script pour déboguer les demandes dans localStorage
const debugDemandes = () => {
  console.log('🔍 Debug des demandes...');
  
  if (typeof window !== 'undefined') {
    const demandes = localStorage.getItem('ekicare_demandes');
    if (demandes) {
      try {
        const parsed = JSON.parse(demandes);
        console.log(`📊 ${parsed.length} demandes trouvées:`);
        parsed.forEach((demande, index) => {
          console.log(`${index + 1}. Demande:`, {
            id: demande.id,
            pro_id: demande.pro_id,
            statut: demande.statut,
            proprio: demande.proprio,
            equide: demande.equide,
            pro: demande.pro
          });
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

debugDemandes();

