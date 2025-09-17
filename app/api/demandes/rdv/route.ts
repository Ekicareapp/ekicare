import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est un propriétaire
    if (session.user.role !== "PROPRIETAIRE") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { 
      proId, 
      date, 
      heure, 
      description, 
      adresse, 
      equides,
      creneauxAlternatifs 
    } = body;

    // Validation des données
    if (!proId || !date || !heure || !description || !adresse || !equides || equides.length === 0) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
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

    // Vérifier que le professionnel existe
    const { data: proProfile, error: proError } = await supabase
      .from('pro_profiles')
      .select('id, nom, prenom')
      .eq('id', proId)
      .single();

    if (proError || !proProfile) {
      return NextResponse.json({ error: "Professionnel non trouvé" }, { status: 404 });
    }

    // Vérifier que les équidés appartiennent au propriétaire
    const { data: equidesData, error: equidesError } = await supabase
      .from('equides')
      .select('id')
      .eq('proprio_id', proprioProfile.id)
      .in('id', equides);

    if (equidesError || !equidesData || equidesData.length !== equides.length) {
      return NextResponse.json({ error: "Un ou plusieurs équidés ne vous appartiennent pas" }, { status: 400 });
    }

    // Créer la date complète
    const dateComplete = new Date(`${date}T${heure}:00`);

    // Créer la demande dans la base de données
    const { data: demande, error: demandeError } = await supabase
      .from('demandes')
      .insert({
        proprio_id: proprioProfile.id,
        equide_id: equides[0],
        pro_id: proId,
        type: 'consultation',
        statut: 'EN_ATTENTE',
        date: dateComplete.toISOString(),
        adresse: adresse,
        description: description,
        creneaux_alternatifs: creneauxAlternatifs || []
      })
      .select()
      .single();

    if (demandeError) {
      console.error("Erreur lors de la création de la demande:", demandeError);
      return NextResponse.json({ error: "Erreur lors de la création de la demande" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      demande: demande,
      message: "Demande de rendez-vous envoyée avec succès" 
    });

  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
