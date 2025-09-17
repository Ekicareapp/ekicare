import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || input.length < 2) {
      return NextResponse.json({ error: 'Au moins 2 caractères requis' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API Google Places non configurée' }, { status: 500 });
    }

    // Appel à l'API Google Places Autocomplete
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&types=geocode&language=fr&region=fr`
    );

    const data = await response.json();

    if (data.status === 'OK') {
      return NextResponse.json({
        predictions: data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description,
          structured_formatting: prediction.structured_formatting
        }))
      });
    } else {
      return NextResponse.json({ 
        error: 'Erreur lors de l\'autocomplétion',
        details: data.error_message || data.status
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Erreur autocomplétion:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'autocomplétion',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

