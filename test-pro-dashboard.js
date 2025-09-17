// Test pour vérifier que les demandes s'affichent côté professionnel
const testProDashboard = async () => {
  console.log('🧪 Test du dashboard professionnel...');
  
  try {
    // Vérifier que le serveur répond
    const response = await fetch('http://localhost:3000/api/auth/session');
    console.log('✅ Serveur accessible');
    
    // Vérifier le localStorage
    if (typeof window !== 'undefined') {
      const demandes = localStorage.getItem('ekicare_demandes');
      if (demandes) {
        const parsed = JSON.parse(demandes);
        console.log(`📊 ${parsed.length} demandes dans localStorage`);
        parsed.forEach((demande, index) => {
          console.log(`${index + 1}. ${demande.pro?.prenom} ${demande.pro?.nom} - ${demande.statut}`);
        });
      } else {
        console.log('⚠️ Aucune demande dans localStorage');
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testProDashboard();

