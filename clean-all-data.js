// Script de nettoyage complet pour tester sainement
console.log('🧹 Nettoyage complet des données...');

// 1. Nettoyer localStorage
localStorage.removeItem('ekicare_demandes');
localStorage.removeItem('ekicare_rendez_vous');
localStorage.removeItem('ekicare_clients');

console.log('✅ localStorage nettoyé');

// 2. Créer des données de test propres
const testDemande = {
  id: `demande_${Date.now()}`,
  pro_id: 'test_pro_id',
  proprio_id: 'test_proprio_id',
  equide_id: 'test_equide_id',
  statut: 'EN_ATTENTE',
  type: 'consultation',
  date: new Date().toISOString(),
  adresse: '123 Rue Test, Ville Test',
  description: 'Test de consultation vétérinaire',
  creneaux_alternatifs: [],
  created_at: new Date().toISOString(),
  proprio: {
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@test.com',
    telephone: '0123456789'
  },
  equide: {
    nom: 'Bella',
    race: 'Pur-sang',
    age: 7
  },
  pro: {
    id: 'test_pro_id',
    nom: 'Dupont',
    prenom: 'Dr. Jean',
    profession: 'Vétérinaire'
  }
};

// 3. Ajouter la demande de test
localStorage.setItem('ekicare_demandes', JSON.stringify([testDemande]));

console.log('✅ Demande de test créée:', testDemande);

// 4. Déclencher l'événement de mise à jour
window.dispatchEvent(new CustomEvent('demandeUpdated', { 
  detail: { demandeId: testDemande.id, nouveauStatut: 'EN_ATTENTE' } 
}));

console.log('✅ Événement de mise à jour déclenché');

// 5. Instructions
console.log(`
🎯 Instructions de test :

1. Rechargez la page (F5)
2. Allez sur "Mes rendez-vous" (onglet professionnel)
3. Vous devriez voir "Sophie Martin - Bella"
4. Testez les boutons :
   - Accepter → Notification verte
   - Refuser → Notification rouge
   - Replanifier → Modal de replanification
5. Vérifiez le tableau de bord → Statistiques mises à jour

🧹 Nettoyage terminé - Prêt pour les tests !
`);

