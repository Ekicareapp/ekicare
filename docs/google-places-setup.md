# Configuration de l'API Google Places

## Étapes pour configurer l'autocomplétion de localisation

### 1. Obtenir une clé API Google Places

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Places API" et "Maps JavaScript API"
4. Créez des identifiants (clé API)
5. Restreignez la clé API aux domaines de votre application

### 2. Configuration de la variable d'environnement

Ajoutez la clé API dans votre fichier `.env.local` :

```bash
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

### 3. Fonctionnalités implémentées

- ✅ Autocomplétion en temps réel pendant la saisie
- ✅ Suggestions de villes françaises
- ✅ Interface utilisateur avec icônes de localisation
- ✅ Fallback avec suggestions simulées si l'API n'est pas configurée
- ✅ Gestion des erreurs et des cas limites

### 4. Utilisation

Le champ de localisation dans l'onglet "Rechercher un pro" du dashboard proprio :
- Affiche des suggestions dès que l'utilisateur tape 2 caractères
- Propose des localisations précises avec format "Ville, Région"
- Permet la sélection par clic sur une suggestion
- Se ferme automatiquement après sélection ou perte de focus

### 5. Coûts

L'API Google Places est facturée selon l'utilisation :
- Autocomplétion : ~0,0027€ par requête
- Détails de lieu : ~0,017€ par requête

Pour une application avec usage modéré, les coûts restent très faibles.
