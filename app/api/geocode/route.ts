import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Adresse requise' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API Google Places non configurée' }, { status: 500 });
    }

    // Appel à l'API Google Geocoding
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return NextResponse.json({
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        formatted_address: result.formatted_address,
        place_id: result.place_id
      });
    } else {
      return NextResponse.json({ 
        error: 'Adresse non trouvée',
        details: data.error_message || data.status
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Erreur géocodage:', error);
    return NextResponse.json({ 
      error: 'Erreur lors du géocodage',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

