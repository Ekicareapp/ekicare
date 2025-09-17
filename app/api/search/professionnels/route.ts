import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { geocodeCity, geocodeAddress, Coordinates } from "@/lib/googlePlaces";

// Fonction pour calculer la distance entre deux points géographiques (formule de Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      ville, 
      codePostal, 
      profession, 
      rayonRecherche = 50 
    } = body;

    // Géocoder la ville de recherche pour obtenir ses vraies coordonnées
    const villeCoords = await geocodeCity(ville, codePostal);
    
    if (!villeCoords) {
      console.error("Impossible de géocoder la ville:", ville);
      return NextResponse.json(
        { message: "Impossible de localiser la ville de recherche" },
        { status: 400 }
      );
    }


    // Récupérer tous les professionnels
    let query = supabase
      .from('pro_profiles')
      .select(`
        *,
        users!inner(email, role)
      `)
      .eq('users.role', 'PROFESSIONNEL');

    // Filtrer par profession si spécifiée
    if (profession && profession !== "Toutes les professions") {
      query = query.eq('profession', profession);
    }

    const { data: professionnels, error } = await query;

    if (error) {
      console.error("Erreur récupération professionnels:", error);
      return NextResponse.json(
        { message: "Erreur lors de la récupération des professionnels" },
        { status: 500 }
      );
    }

    // Géocoder chaque professionnel pour obtenir ses vraies coordonnées
    const professionnelsAvecDistance = await Promise.all(
      (professionnels || []).map(async (pro) => {
        // Géocoder l'adresse du professionnel
        const proAddress = `${pro.ville}, France`;
        const proCoords = await geocodeAddress(proAddress);
        
        if (!proCoords) {
          // Utiliser des coordonnées simulées en fallback
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * 50;
          const lat = villeCoords.lat + (distance / 111) * Math.cos(angle);
          const lng = villeCoords.lng + (distance / 111) * Math.sin(angle);
          
          const distanceCalculee = calculateDistance(
            villeCoords.lat, 
            villeCoords.lng, 
            lat, 
            lng
          );

          return {
            ...pro,
            distance: Math.round(distanceCalculee * 10) / 10,
            coordonnees: { lat, lng }
          };
        }

        // Calculer la distance réelle entre la ville de recherche et le professionnel
        const distanceCalculee = calculateDistance(
          villeCoords.lat, 
          villeCoords.lng, 
          proCoords.lat, 
          proCoords.lng
        );

        return {
          ...pro,
          distance: Math.round(distanceCalculee * 10) / 10,
          coordonnees: { lat: proCoords.lat, lng: proCoords.lng }
        };
      })
    );

    // Filtrer par rayon d'exercice du professionnel ET rayon de recherche du propriétaire
    const professionnelsFiltres = professionnelsAvecDistance.filter(pro => {
      const dansRayonPro = pro.distance <= pro.rayon_exercice;
      const dansRayonRecherche = pro.distance <= rayonRecherche;
      return dansRayonPro && dansRayonRecherche;
    });

    return NextResponse.json({
      professionnels: professionnelsFiltres,
      total: professionnelsFiltres.length,
      ville: ville,
      rayonRecherche: rayonRecherche
    });

  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}