console.log('🔍 Debug de la génération des créneaux...');

// Test simple de génération de créneaux
const dureeConsultation = 45; // 45 minutes
const jourDisponibilites = { matin: true, apresMidi: true, soir: false };

console.log('📊 Durée de consultation:', dureeConsultation, 'minutes');
console.log('📅 Disponibilités du jour:', jourDisponibilites);

const creneaux = [];

// Créneaux du matin (8h-12h)
if (jourDisponibilites.matin) {
  console.log('\n🌅 Génération des créneaux du matin:');
  for (let heure = 8; heure < 12; heure += dureeConsultation / 60) {
    const heureEntiere = Math.floor(heure);
    const minutes = Math.round((heure % 1) * 60);
    const heureStr = `${heureEntiere.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    console.log(`  - ${heureStr} (heure calculée: ${heure})`);
    creneaux.push(heureStr);
  }
}

// Créneaux de l'après-midi (14h-18h)
if (jourDisponibilites.apresMidi) {
  console.log('\n🌞 Génération des créneaux de l\'après-midi:');
  for (let heure = 14; heure < 18; heure += dureeConsultation / 60) {
    const heureEntiere = Math.floor(heure);
    const minutes = Math.round((heure % 1) * 60);
    const heureStr = `${heureEntiere.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    console.log(`  - ${heureStr} (heure calculée: ${heure})`);
    creneaux.push(heureStr);
  }
}

console.log('\n✅ Créneaux finaux:', creneaux);
console.log(`📊 Total: ${creneaux.length} créneaux générés`);

