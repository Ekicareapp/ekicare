// Script de test pour vérifier la mise à jour du tableau de bord
console.log('🧪 Test de mise à jour du tableau de bord');

// Simuler une demande acceptée
const testDemande = {
  id: 'test_demande_123',
  pro_id: 'test_pro_id',
  statut: 'ACCEPTEE',
  date: new Date().toISOString(),
  description: 'Test de consultation',
  adresse: '123 Rue Test',
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
  }
};

// Ajouter la demande au localStorage
const existingDemandes = JSON.parse(localStorage.getItem('ekicare_demandes') || '[]');
existingDemandes.push(testDemande);
localStorage.setItem('ekicare_demandes', JSON.stringify(existingDemandes));

// Déclencher l'événement de mise à jour
window.dispatchEvent(new CustomEvent('demandeUpdated', { 
  detail: { demandeId: testDemande.id, nouveauStatut: 'ACCEPTEE' } 
}));

console.log('✅ Test terminé - Vérifiez le tableau de bord');

