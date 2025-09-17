// Configuration pour l'API Google Places
export const GOOGLE_PLACES_CONFIG = {
  // TODO: Ajouter votre clé API Google Places ici
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
  // Configuration pour l'autocomplétion
  autocomplete: {
    types: ['address'], // Adresses complètes
    language: 'fr', // Langue française
    region: 'fr', // Région France
  }
};

// Interface pour les suggestions de localisation
export interface LocalisationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Fonction pour récupérer les suggestions depuis Google Places API
export async function fetchGooglePlacesSuggestions(
  input: string,
  sessionToken?: string
): Promise<LocalisationSuggestion[]> {
  if (!input || input.length < 2) {
    return [];
  }

  // Si pas de clé API, retourner des suggestions de test
  if (!GOOGLE_PLACES_CONFIG.apiKey) {
    console.warn('Clé API Google Places non configurée - utilisation des suggestions de test');
    return getTestSuggestions(input);
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      `input=${encodeURIComponent(input)}&` +
      `types=${GOOGLE_PLACES_CONFIG.autocomplete.types.join('|')}&` +
      `language=${GOOGLE_PLACES_CONFIG.autocomplete.language}&` +
      `region=${GOOGLE_PLACES_CONFIG.autocomplete.region}&` +
      `key=${GOOGLE_PLACES_CONFIG.apiKey}` +
      (sessionToken ? `&sessiontoken=${sessionToken}` : '')
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Erreur Google Places API: ${data.status}`);
    }

    return data.predictions || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions Google Places:', error);
    // En cas d'erreur, retourner des suggestions de test
    return getTestSuggestions(input);
  }
}

// Suggestions de test pour le développement
function getTestSuggestions(input: string): LocalisationSuggestion[] {
  const testAddresses = [
    "123 Rue de la Paix, 75001 Paris, France",
    "45 Avenue des Champs-Élysées, 75008 Paris, France",
    "12 Place de la Concorde, 75001 Paris, France",
    "78 Boulevard Saint-Germain, 75005 Paris, France",
    "23 Rue de Rivoli, 75004 Paris, France",
    "56 Avenue Montaigne, 75008 Paris, France",
    "89 Rue de la République, 69002 Lyon, France",
    "34 Cours Mirabeau, 13100 Aix-en-Provence, France",
    "67 Place Bellecour, 69002 Lyon, France",
    "12 Rue de la Paix, 13001 Marseille, France"
  ];

  return testAddresses
    .filter(addr => addr.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5)
    .map((addr, index) => ({
      place_id: `test_${index}`,
      description: addr,
      structured_formatting: {
        main_text: addr.split(',')[0],
        secondary_text: addr.split(',').slice(1).join(',').trim()
      }
    }));
}

// Fonction pour obtenir les détails d'un lieu
export async function getPlaceDetails(
  placeId: string,
  sessionToken?: string
): Promise<any> {
  if (!GOOGLE_PLACES_CONFIG.apiKey) {
    console.warn('Clé API Google Places non configurée');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&` +
      `fields=formatted_address,geometry,address_components&` +
      `language=${GOOGLE_PLACES_CONFIG.autocomplete.language}&` +
      `key=${GOOGLE_PLACES_CONFIG.apiKey}` +
      (sessionToken ? `&sessiontoken=${sessionToken}` : '')
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Erreur Google Places API: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du lieu:', error);
    return null;
  }
}

// Interface pour les coordonnées géographiques
export interface Coordinates {
  lat: number;
  lng: number;
}

// Fonction pour géocoder une adresse et obtenir ses coordonnées
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  if (!GOOGLE_PLACES_CONFIG.apiKey) {
    console.warn('Clé API Google Places non configurée - utilisation de coordonnées simulées');
    return getSimulatedCoordinates(address);
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?` +
      `address=${encodeURIComponent(address)}&` +
      `language=${GOOGLE_PLACES_CONFIG.autocomplete.language}&` +
      `region=${GOOGLE_PLACES_CONFIG.autocomplete.region}&` +
      `key=${GOOGLE_PLACES_CONFIG.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.warn(`Aucun résultat de géocodage pour: ${address}`);
      return getSimulatedCoordinates(address);
    }

    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng
    };
  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    return getSimulatedCoordinates(address);
  }
}

// Fonction pour géocoder une ville et obtenir ses coordonnées
export async function geocodeCity(city: string, postalCode?: string): Promise<Coordinates | null> {
  const address = postalCode ? `${city}, ${postalCode}, France` : `${city}, France`;
  return geocodeAddress(address);
}

// Coordonnées simulées pour le développement (fallback)
function getSimulatedCoordinates(address: string): Coordinates {
  // Coordonnées par défaut pour les principales villes françaises
  const cityCoordinates: { [key: string]: Coordinates } = {
    'paris': { lat: 48.8566, lng: 2.3522 },
    'lyon': { lat: 45.7640, lng: 4.8357 },
    'marseille': { lat: 43.2965, lng: 5.3698 },
    'toulouse': { lat: 43.6047, lng: 1.4442 },
    'nice': { lat: 43.7102, lng: 7.2620 },
    'nantes': { lat: 47.2184, lng: -1.5536 },
    'strasbourg': { lat: 48.5734, lng: 7.7521 },
    'montpellier': { lat: 43.6110, lng: 3.8767 },
    'bordeaux': { lat: 44.8378, lng: -0.5792 },
    'lille': { lat: 50.6292, lng: 3.0573 }
  };

  const addressLower = address.toLowerCase();
  
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (addressLower.includes(city)) {
      // Ajouter une petite variation aléatoire pour simuler des adresses différentes
      const variation = 0.01; // ~1km de variation
      return {
        lat: coords.lat + (Math.random() - 0.5) * variation,
        lng: coords.lng + (Math.random() - 0.5) * variation
      };
    }
  }

  // Coordonnées par défaut (Paris) avec variation
  return {
    lat: 48.8566 + (Math.random() - 0.5) * 0.1,
    lng: 2.3522 + (Math.random() - 0.5) * 0.1
  };
}
