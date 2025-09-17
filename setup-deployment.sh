#!/bin/bash

echo "🚀 Configuration du déploiement EkiCare"
echo "======================================"

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "❌ Git n'est pas initialisé. Initialisation..."
    git init
fi

# Ajouter tous les fichiers
echo "📁 Ajout des fichiers..."
git add .

# Commit
echo "💾 Commit des changements..."
git commit -m "Setup deployment configuration - $(date)"

echo "✅ Configuration terminée !"
echo ""
echo "📋 PROCHAINES ÉTAPES À FAIRE :"
echo "================================"
echo ""
echo "1. 🌐 CRÉER LE REPOSITORY GITHUB :"
echo "   - Allez sur https://github.com"
echo "   - Cliquez 'New repository'"
echo "   - Nom : 'ekicare'"
echo "   - NE cochez PAS 'Add README'"
echo "   - Cliquez 'Create repository'"
echo ""
echo "2. 🔗 CONNECTER LE REPOSITORY :"
echo "   git remote add origin https://github.com/VOTRE-USERNAME/ekicare.git"
echo "   git push -u origin main"
echo ""
echo "3. 🚀 DÉPLOYER SUR VERCEL :"
echo "   - Allez sur https://vercel.com"
echo "   - Connectez-vous avec GitHub"
echo "   - Importez le repository 'ekicare'"
echo "   - Configurez les variables d'environnement"
echo "   - Déployez !"
echo ""
echo "📖 Guide détaillé : DEPLOYMENT_GUIDE.md"
echo "🔧 Script de déploiement : ./deploy.sh"
