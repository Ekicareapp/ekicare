import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est un propriétaire
    if (session.user.role !== "PROPRIETAIRE") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer le profil propriétaire
    const { data: proprioProfile, error: proprioError } = await supabase
      .from('proprio_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (proprioError || !proprioProfile) {
      return NextResponse.json({ error: "Profil propriétaire non trouvé" }, { status: 404 });
    }

    // Récupérer les équidés du propriétaire
    const { data: equides, error: equidesError } = await supabase
      .from('equides')
      .select('*')
      .eq('proprio_id', proprioProfile.id)
      .order('nom', { ascending: true });

    if (equidesError) {
      console.error("Erreur lors de la récupération des équidés:", equidesError);
      return NextResponse.json({ error: "Erreur lors de la récupération des équidés" }, { status: 500 });
    }

    return NextResponse.json({ equides: equides || [] });

  } catch (error) {
    console.error("Erreur lors de la récupération des équidés:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
