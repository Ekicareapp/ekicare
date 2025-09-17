# 🚀 Guide de Configuration - Ekicare Web App

## 📋 Prérequis

1. **Node.js** (version 18+)
2. **PostgreSQL** (local ou cloud)
3. **Git**

## 🗄️ Configuration de la Base de Données

### Option 1: PostgreSQL Local
```bash
# Installer PostgreSQL
brew install postgresql
brew services start postgresql

# Créer la base de données
createdb ekicare
```

### Option 2: Supabase (Recommandé)
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer l'URL de connexion

## ⚙️ Configuration

### 1. Variables d'environnement
Créer un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ekicare?schema=public"
# OU pour Supabase :
# DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Pusher (optionnel - pour les notifications temps réel)
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-key"
PUSHER_APP_SECRET="your-pusher-secret"
PUSHER_APP_ID="your-pusher-id"
PUSHER_APP_CLUSTER="your-pusher-cluster"

# Stripe (optionnel - pour les paiements)
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 2. Initialiser la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Créer les migrations
npx prisma migrate dev --name init

# (Optionnel) Remplir avec des données de test
npx prisma db seed
```

### 3. Démarrer l'application
```bash
npm run dev
```

## 🔧 Fonctionnalités Configurées

### ✅ Authentification
- NextAuth.js avec JWT
- Support des rôles (Propriétaire/Professionnel)
- Protection des routes

### ✅ Base de Données
- Prisma ORM
- PostgreSQL
- Schéma complet avec relations

### ✅ API Routes
- `/api/auth/*` - Authentification
- `/api/rendez-vous` - Gestion des rendez-vous
- `/api/demandes` - Gestion des demandes
- `/api/clients` - Gestion des clients

### ✅ Types TypeScript
- Types pour NextAuth
- Types pour Prisma
- Types personnalisés

## 🚀 Prochaines Étapes

1. **Configurer la base de données** (PostgreSQL ou Supabase)
2. **Créer le fichier `.env`** avec vos clés
3. **Exécuter les migrations** Prisma
4. **Tester l'authentification**
5. **Intégrer les APIs** dans le frontend

## 📱 Intégration Frontend

Les composants existants peuvent maintenant être connectés aux vraies APIs :

```typescript
// Exemple d'utilisation
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, isLoading } = useAuth('pro');
  
  if (isLoading) return <div>Chargement...</div>;
  
  return <div>Bonjour {user?.email}</div>;
}
```

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt
- JWT pour les sessions
- Protection CSRF
- Validation des données

## 📊 Monitoring

- Logs d'erreurs
- Validation des entrées
- Gestion des erreurs API

---

**Note**: Ce guide te permet de transformer le prototype en application fonctionnelle. Tous les composants UI existants sont prêts à être connectés aux APIs !
