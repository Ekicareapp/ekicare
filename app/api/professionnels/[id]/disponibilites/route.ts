import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proId = params.id;

    if (!proId) {
      return NextResponse.json({ error: "ID du professionnel requis" }, { status: 400 });
    }

    // Récupérer les disponibilités et la durée de consultation du professionnel
    const { data: proProfile, error } = await supabase
      .from('pro_profiles')
      .select('duree_consultation, disponibilites')
      .eq('id', proId)
      .single();

    if (error || !proProfile) {
      console.error("Erreur lors de la récupération du profil:", error);
      return NextResponse.json({ error: "Professionnel non trouvé" }, { status: 404 });
    }

    // Retourner les disponibilités et la durée de consultation
    return NextResponse.json({
      dureeConsultation: proProfile.duree_consultation || 60, // 60 minutes par défaut
      disponibilites: proProfile.disponibilites || {
        lundi: { matin: true, apresMidi: true, soir: false },
        mardi: { matin: true, apresMidi: true, soir: false },
        mercredi: { matin: true, apresMidi: true, soir: false },
        jeudi: { matin: true, apresMidi: true, soir: false },
        vendredi: { matin: true, apresMidi: true, soir: false },
        samedi: { matin: true, apresMidi: false, soir: false },
        dimanche: { matin: false, apresMidi: false, soir: false }
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
