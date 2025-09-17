import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

// GET /api/rendez-vous - Récupérer les rendez-vous
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const userId = session.user.id;

    let rendezVous;

    if (role === "pro") {
      // Rendez-vous du professionnel
      const { data: proProfile } = await supabase
        .from('pro_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!proProfile) {
        return NextResponse.json({ error: "Profil professionnel non trouvé" }, { status: 404 });
      }

      // Pour l'instant, retourner un tableau vide car la table rendez_vous n'existe pas encore
      rendezVous = [];
    } else {
      // Rendez-vous du propriétaire
      const { data: proprioProfile } = await supabase
        .from('proprio_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!proprioProfile) {
        return NextResponse.json({ error: "Profil propriétaire non trouvé" }, { status: 404 });
      }

      // Pour l'instant, retourner un tableau vide car la table rendez_vous n'existe pas encore
      rendezVous = [];
    }

    // Transformer les données pour correspondre à la structure attendue par le frontend
    const transformedRendezVous = rendezVous.map(rdv => ({
      id: rdv.id,
      date: new Date(rdv.date).toISOString().split('T')[0],
      heure: new Date(rdv.date).toISOString().split('T')[1].substring(0, 5),
      statut: rdv.statut.toLowerCase(),
      notes: rdv.notes,
      client: rdv.client ? {
        id: rdv.client.id,
        nom: rdv.client.nom,
        prenom: rdv.client.prenom,
        telephone: rdv.client.telephone,
        adresse: rdv.client.adresse,
        ville: rdv.client.ville
      } : null,
      equide: rdv.demande?.equide ? {
        id: rdv.demande.equide.id,
        nom: rdv.demande.equide.nom,
        age: rdv.demande.equide.age,
        race: rdv.demande.equide.race
      } : null
    }));

    return NextResponse.json(transformedRendezVous);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/rendez-vous - Créer un rendez-vous
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { demandeId, proId, clientId, date, notes } = body;

    const { data: rendezVous, error: rdvError } = await supabase
      .from('rendez_vous')
      .insert({
        demande_id: demandeId,
        pro_id: proId,
        client_id: clientId,
        date: new Date(date).toISOString(),
        notes,
        statut: "CONFIRME"
      })
      .select(`
        *,
        client:clients(*),
        pro:pro_profiles(*),
        demande:demandes(
          *,
          equide:equides(*),
          proprio:proprio_profiles(*)
        )
      `)
      .single();

    if (rdvError) throw rdvError;

    // Mettre à jour le statut de la demande
    const { error: demandeError } = await supabase
      .from('demandes')
      .update({ statut: "ACCEPTEE" })
      .eq('id', demandeId);

    if (demandeError) throw demandeError;

    return NextResponse.json(rendezVous);
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
