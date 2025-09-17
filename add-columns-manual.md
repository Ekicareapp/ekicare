# Instructions pour ajouter les colonnes dans Supabase

## 1. Aller dans l'interface Supabase
- Ouvrir le projet Supabase
- Aller dans l'onglet "Table Editor"
- Sélectionner la table `pro_profiles`

## 2. Ajouter les colonnes

### Colonne 1: duree_consultation
- Cliquer sur "Add Column"
- Nom: `duree_consultation`
- Type: `int4` (integer)
- Default value: `60`
- Nullable: Oui

### Colonne 2: disponibilites
- Cliquer sur "Add Column"
- Nom: `disponibilites`
- Type: `jsonb`
- Default value: 
```json
{
  "lundi": {"matin": true, "apresMidi": true, "soir": false},
  "mardi": {"matin": true, "apresMidi": true, "soir": false},
  "mercredi": {"matin": true, "apresMidi": true, "soir": false},
  "jeudi": {"matin": true, "apresMidi": true, "soir": false},
  "vendredi": {"matin": true, "apresMidi": true, "soir": false},
  "samedi": {"matin": true, "apresMidi": false, "soir": false},
  "dimanche": {"matin": false, "apresMidi": false, "soir": false}
}
```
- Nullable: Oui

## 3. Sauvegarder
- Cliquer sur "Save" pour chaque colonne
- Les colonnes seront ajoutées à la table

## 4. Vérifier
- Les colonnes devraient maintenant apparaître dans la table
- Les valeurs par défaut seront appliquées aux enregistrements existants

