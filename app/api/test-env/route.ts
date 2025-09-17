import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vérifier les variables d'environnement côté serveur
    const envStatus = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_PLACES_API_KEY: !!process.env.GOOGLE_PLACES_API_KEY,
    };

    return NextResponse.json(envStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des variables d\'environnement' },
      { status: 500 }
    );
  }
}
