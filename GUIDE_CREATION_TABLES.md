# Guide de création des tables manquantes dans Supabase

## 🎯 Problème actuel
Le système de réservation fonctionne en mode "simulation" car les tables `demandes`, `rendez_vous` et `clients` n'existent pas dans Supabase.

## 📋 Tables à créer

### 1. Table `demandes`
```sql
CREATE TABLE demandes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proprio_id UUID NOT NULL REFERENCES proprio_profiles(id) ON DELETE CASCADE,
    pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
    equide_id UUID NOT NULL REFERENCES equides(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'consultation',
    statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    adresse TEXT NOT NULL,
    telephone VARCHAR(20),
    description TEXT NOT NULL,
    creneaux_alternatifs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Table `rendez_vous`
```sql
CREATE TABLE rendez_vous (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    demande_id UUID NOT NULL REFERENCES demandes(id) ON DELETE CASCADE,
    pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
    proprio_id UUID NOT NULL REFERENCES proprio_profiles(id) ON DELETE CASCADE,
    equide_id UUID NOT NULL REFERENCES equides(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    duree INTEGER NOT NULL DEFAULT 60,
    adresse TEXT NOT NULL,
    description TEXT,
    statut VARCHAR(20) NOT NULL DEFAULT 'CONFIRME',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Table `clients`
```sql
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
    proprio_id UUID NOT NULL REFERENCES proprio_profiles(id) ON DELETE CASCADE,
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pro_id, proprio_id)
);
```

## 🔧 Comment créer les tables

### Option 1: Interface Supabase (Recommandée)
1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans "SQL Editor"
4. Collez chaque requête SQL une par une
5. Exécutez chaque requête

### Option 2: Via l'API REST
Utilisez l'API REST de Supabase pour créer les tables via des requêtes HTTP.

## 🎯 Après création des tables

Une fois les tables créées, nous devrons :
1. Modifier l'API `/api/demandes/rdv` pour utiliser les vraies tables
2. Créer une API pour récupérer les demandes du professionnel
3. Ajouter un système de notifications

## 📞 Support
Si vous avez des difficultés, je peux vous aider à créer les tables via l'interface Supabase ou adapter le code pour fonctionner sans ces tables.

