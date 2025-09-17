const fs = require('fs');
const path = require('path');

const files = [
  'app/components/dashboard/ProDashboardReal.tsx',
  'app/components/dashboard/ProClients.tsx',
  'app/components/dashboard/ProRendezVous.tsx',
  'app/components/dashboard/ProTournees.tsx',
  'app/components/dashboard/ProClientsReal.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer les tableaux mock par des tableaux vides
    content = content.replace(/const mockRendezVous: any\[\] = \[[\s\S]*?\];/g, 'const mockRendezVous: any[] = [];');
    content = content.replace(/const mockRendezVous: RendezVous\[\] = \[[\s\S]*?\];/g, 'const mockRendezVous: RendezVous[] = [];');
    content = content.replace(/const mockClients: Client\[\] = \[[\s\S]*?\];/g, 'const mockClients: Client[] = [];');
    
    // Nettoyer les objets mock
    content = content.replace(/const mockProProfile = \{[\s\S]*?\};/g, 'const mockProProfile = {};');
    content = content.replace(/const mockStats = \{[\s\S]*?\};/g, 'const mockStats = {};');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Nettoyé: ${file}`);
  }
});

console.log('🎉 Tous les fichiers Pro nettoyés !');

