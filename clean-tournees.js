const fs = require('fs');

const filePath = '/Users/tiberefillie/Desktop/EKICARE/ekicarecursor/app/components/dashboard/ProTourneesReal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Nettoyer toutes les données mock restantes
content = content.replace(/const mockRendezVousAcceptes: any\[\] = \[\];.*?telephone: "06 23 45 67 89",[\s\S]*?heure: "15:30",/g, 'const mockRendezVousAcceptes: any[] = [];');
content = content.replace(/const mockTournees: any\[\] = \[\];.*?telephone: "06 23 45 67 89",[\s\S]*?heure: "15:30",/g, 'const mockTournees: any[] = [];');

// Supprimer toutes les lignes avec des données mock qui traînent
const lines = content.split('\n');
const cleanLines = [];
let skipUntil = -1;

for (let i = 0; i < lines.length; i++) {
  if (skipUntil >= i) continue;
  
  if (lines[i].includes('telephone: "06') || lines[i].includes('equide: "') || lines[i].includes('heure: "')) {
    // Trouver la fin de ce bloc de données mock
    skipUntil = i;
    while (skipUntil < lines.length && (lines[skipUntil].includes('telephone:') || lines[skipUntil].includes('equide:') || lines[skipUntil].includes('heure:') || lines[skipUntil].includes('},'))) {
      skipUntil++;
    }
    i = skipUntil - 1;
    continue;
  }
  
  cleanLines.push(lines[i]);
}

fs.writeFileSync(filePath, cleanLines.join('\n'));
console.log('✅ ProTourneesReal.tsx nettoyé !');

