#!/bin/bash

echo "🚀 Déploiement EkiCare sur Vercel"
echo "================================="

# Vérifier que Git est initialisé
if [ ! -d ".git" ]; then
    echo "❌ Git n'est pas initialisé. Exécutez d'abord: git init"
    exit 1
fi

# Vérifier que le repository distant est configuré
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Aucun repository distant configuré."
    echo "📝 Instructions:"
    echo "1. Créez un repository sur GitHub.com"
    echo "2. Exécutez: git remote add origin https://github.com/VOTRE-USERNAME/ekicare.git"
    echo "3. Relancez ce script"
    exit 1
fi

# Ajouter tous les fichiers
echo "📁 Ajout des fichiers..."
git add .

# Commit des changements
echo "💾 Commit des changements..."
git commit -m "Deploy to Vercel - $(date)"

# Push vers GitHub
echo "⬆️ Push vers GitHub..."
git push origin main

echo "✅ Code poussé vers GitHub !"
echo ""
echo "🔗 Prochaines étapes:"
echo "1. Allez sur https://vercel.com"
echo "2. Connectez votre compte GitHub"
echo "3. Importez le repository 'ekicare'"
echo "4. Configurez les variables d'environnement"
echo "5. Déployez !"
