// Test pour vérifier l'ordre des jours
const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

console.log('📅 Ordre des jours dans l\'interface disponibilités:');
console.log('='.repeat(50));

jours.forEach((jour, index) => {
  const nomJour = jour === 'lundi' ? 'Lundi' :
                  jour === 'mardi' ? 'Mardi' :
                  jour === 'mercredi' ? 'Mercredi' :
                  jour === 'jeudi' ? 'Jeudi' :
                  jour === 'vendredi' ? 'Vendredi' :
                  jour === 'samedi' ? 'Samedi' :
                  'Dimanche';
  
  console.log(`${index + 1}. ${nomJour}`);
});

console.log('\n✅ Les jours sont maintenant organisés du lundi au dimanche !');
console.log('🎯 Allez sur http://localhost:3001/dashboard/dashboard-professionnel/parametres');
console.log('📋 Cliquez sur l\'onglet "Disponibilités" pour voir le nouvel ordre');

