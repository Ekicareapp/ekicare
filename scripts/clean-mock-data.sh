#!/bin/bash

echo "🧹 Nettoyage des données mock restantes..."

# Fichiers à nettoyer
FILES=(
  "app/components/dashboard/ProTourneesReal.tsx"
  "app/components/dashboard/ProDashboard.tsx"
  "app/components/dashboard/ProClientsReal.tsx"
  "app/components/dashboard/ProTournees.tsx"
  "app/components/dashboard/ProRendezVous.tsx"
  "app/components/dashboard/ProClients.tsx"
  "app/components/dashboard/ProDashboardReal.tsx"
)

# Fonction pour nettoyer un fichier
clean_file() {
  local file="$1"
  echo "Nettoyage de $file..."
  
  # Remplacer les tableaux mock par des tableaux vides
  sed -i '' 's/const mockRendezVousAcceptes: any\[\] = \[.*\];/const mockRendezVousAcceptes: any[] = [];/g' "$file"
  sed -i '' 's/const mockTournees: any\[\] = \[.*\];/const mockTournees: any[] = [];/g' "$file"
  sed -i '' 's/const mockRendezVous: any\[\] = \[.*\];/const mockRendezVous: any[] = [];/g' "$file"
  sed -i '' 's/const mockRendezVous: RendezVous\[\] = \[.*\];/const mockRendezVous: RendezVous[] = [];/g' "$file"
  sed -i '' 's/const mockClients: Client\[\] = \[.*\];/const mockClients: Client[] = [];/g' "$file"
  
  # Nettoyer les objets mock simples
  sed -i '' 's/const mockProProfile = {[^}]*};/const mockProProfile = {};/g' "$file"
  sed -i '' 's/const mockStats = {[^}]*};/const mockStats = {};/g' "$file"
  sed -i '' 's/const mockProfil: ProfilPro = {[^}]*};/const mockProfil: ProfilPro = {};/g' "$file"
}

# Nettoyer chaque fichier
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    clean_file "$file"
  else
    echo "Fichier non trouvé: $file"
  fi
done

echo "✅ Nettoyage terminé !"

