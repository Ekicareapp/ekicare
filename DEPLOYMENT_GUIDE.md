# 🚀 Guide de Déploiement EkiCare sur Vercel

## 📋 Prérequis
- Compte GitHub
- Compte Vercel
- Variables d'environnement Supabase

## 🔧 Étapes de Déploiement

### 1. **Créer le Repository GitHub**

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur **"New repository"**
3. Nom : `ekicare` ou `ekicare-app`
4. Description : `EkiCare - Plateforme de rendez-vous vétérinaires équins`
5. **Ne cochez PAS** "Add a README file"
6. **Ne cochez PAS** "Add .gitignore"
7. Cliquez **"Create repository"**

### 2. **Connecter le Repository Local**

```bash
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/ekicare.git

# Pousser le code
git push -u origin main
```

### 3. **Déployer sur Vercel**

1. Allez sur [Vercel.com](https://vercel.com)
2. Cliquez **"Sign up"** et connectez-vous avec GitHub
3. Cliquez **"New Project"**
4. Importez le repository `ekicare`
5. Cliquez **"Deploy"**

### 4. **Configurer les Variables d'Environnement**

Dans Vercel Dashboard > Settings > Environment Variables, ajoutez :

```
NEXTAUTH_URL = https://votre-domaine.vercel.app
NEXTAUTH_SECRET = votre-secret-nextauth
SUPABASE_URL = votre-url-supabase
SUPABASE_ANON_KEY = votre-cle-supabase-anon
SUPABASE_SERVICE_ROLE_KEY = votre-cle-supabase-service
GOOGLE_PLACES_API_KEY = votre-cle-google-places
```

### 5. **Redéployer**

Après avoir ajouté les variables :
1. Allez dans **Deployments**
2. Cliquez sur **"Redeploy"** sur le dernier déploiement

## 🐛 Résolution de Problèmes

### Erreur de Build
- Vérifiez que toutes les variables d'environnement sont définies
- Regardez les logs de build dans Vercel

### Erreur de Base de Données
- Vérifiez que Supabase est accessible
- Vérifiez les politiques RLS

### Erreur d'Authentification
- Vérifiez NEXTAUTH_URL et NEXTAUTH_SECRET
- Vérifiez la configuration Supabase

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel
2. Vérifiez la console du navigateur
3. Vérifiez les variables d'environnement
