import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

// GET /api/demandes - Récupérer les demandes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const statut = searchParams.get("statut");
    const userId = session.user.id;

    let query;

    let proProfile, proprioProfile;

    if (role === "pro") {
      // Demandes pour les professionnels
      const { data: proProfileData } = await supabase
        .from('pro_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!proProfileData) {
        return NextResponse.json({ error: "Profil professionnel non trouvé" }, { status: 404 });
      }
      proProfile = proProfileData;

      query = supabase
        .from('demandes')
        .select(`
          *,
          equide:equides(*),
          proprio:proprio_profiles(*),
          pro:pro_profiles(*)
        `)
        .eq('pro_id', proProfile.id)
        .not('statut', 'eq', 'ANNULEE') // Exclure les demandes annulées côté pro
        .order('created_at', { ascending: false });
    } else {
      // Demandes du propriétaire
      const { data: proprioProfileData } = await supabase
        .from('proprio_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!proprioProfileData) {
        return NextResponse.json({ error: "Profil propriétaire non trouvé" }, { status: 404 });
      }
      proprioProfile = proprioProfileData;

      query = supabase
        .from('demandes')
        .select(`
          *,
          equide:equides(*),
          proprio:proprio_profiles(*),
          pro:pro_profiles(*)
        `)
        .eq('proprio_id', proprioProfile.id)
        .order('created_at', { ascending: false });
    }

    if (statut) {
      query = query.eq('statut', statut);
    }

    const { data: demandes, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      throw error;
    }

    return NextResponse.json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/demandes - Créer une demande
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { equideId, type, date, adresse, telephone, description, proId } = body;

    // Récupérer le profil propriétaire
    const { data: proprioProfile, error: proprioError } = await supabase
      .from('proprio_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (proprioError || !proprioProfile) {
      return NextResponse.json(
        { error: "Profil propriétaire non trouvé" },
        { status: 404 }
      );
    }

    const { data: demande, error } = await supabase
      .from('demandes')
      .insert({
        proprio_id: proprioProfile.id,
        equide_id: equideId,
        pro_id: proId || null,
        type,
        date: new Date(date).toISOString(),
        adresse,
        telephone,
        description,
        statut: "EN_ATTENTE"
      })
      .select(`
        *,
        equide:equides(*),
        proprio:proprio_profiles(*),
        pro:pro_profiles(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(demande);
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
