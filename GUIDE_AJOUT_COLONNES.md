# Guide pour ajouter les colonnes dans Supabase

## 🎯 Objectif
Ajouter les colonnes `duree_consultation` et `disponibilites` à la table `pro_profiles` pour activer les nouvelles fonctionnalités.

## 📋 Étapes à suivre

### 1. Ouvrir l'interface Supabase
- Allez sur [supabase.com](https://supabase.com)
- Connectez-vous à votre compte
- Sélectionnez votre projet EkiCare

### 2. Accéder au SQL Editor
- Dans le menu de gauche, cliquez sur **"SQL Editor"**
- Cliquez sur **"New query"**

### 3. Exécuter la première requête
Copiez et collez cette requête dans l'éditeur :

```sql
ALTER TABLE pro_profiles 
ADD COLUMN IF NOT EXISTS duree_consultation INTEGER DEFAULT 60;
```

- Cliquez sur **"Run"** (ou Ctrl+Enter)
- Vérifiez que la requête s'exécute sans erreur

### 4. Exécuter la deuxième requête
Copiez et collez cette requête dans l'éditeur :

```sql
ALTER TABLE pro_profiles 
ADD COLUMN IF NOT EXISTS disponibilites JSONB DEFAULT '{
  "lundi": {"matin": true, "apresMidi": true, "soir": false},
  "mardi": {"matin": true, "apresMidi": true, "soir": false},
  "mercredi": {"matin": true, "apresMidi": true, "soir": false},
  "jeudi": {"matin": true, "apresMidi": true, "soir": false},
  "vendredi": {"matin": true, "apresMidi": true, "soir": false},
  "samedi": {"matin": true, "apresMidi": false, "soir": false},
  "dimanche": {"matin": false, "apresMidi": false, "soir": false}
}'::jsonb;
```

- Cliquez sur **"Run"** (ou Ctrl+Enter)
- Vérifiez que la requête s'exécute sans erreur

### 5. Vérifier l'ajout des colonnes
- Allez dans **"Table Editor"**
- Sélectionnez la table **`pro_profiles`**
- Vérifiez que les colonnes `duree_consultation` et `disponibilites` apparaissent

### 6. Tester les fonctionnalités
Retournez dans votre terminal et exécutez :

```bash
node test-complete-functionality.js
```

## ✅ Résultat attendu
- Les colonnes sont ajoutées à la table
- Les valeurs par défaut sont appliquées aux enregistrements existants
- Le professionnel peut maintenant gérer ses disponibilités et la durée de ses consultations
- Toutes les données se sauvegardent automatiquement dans Supabase

## 🆘 En cas de problème
Si vous rencontrez des erreurs :
1. Vérifiez que vous êtes bien connecté à Supabase
2. Vérifiez que vous avez les droits d'administration sur le projet
3. Essayez d'exécuter les requêtes une par une
4. Contactez-moi si le problème persiste

