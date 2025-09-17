import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

// PUT /api/demandes/statut - Mettre à jour le statut d'une demande
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { demandeId, statut, notes, nouvelleDate } = body;

    // Validation des données
    if (!demandeId || !statut) {
      return NextResponse.json({ error: "ID de demande et statut requis" }, { status: 400 });
    }

    // Vérifier que l'utilisateur est un professionnel
    if (session.user.role !== "PROFESSIONNEL") {
      return NextResponse.json({ error: "Accès refusé - Seuls les professionnels peuvent modifier les demandes" }, { status: 403 });
    }

    // Récupérer le profil professionnel
    const { data: proProfile, error: proError } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (proError || !proProfile) {
      return NextResponse.json({ error: "Profil professionnel non trouvé" }, { status: 404 });
    }

    // Vérifier que la demande appartient à ce professionnel
    const { data: demande, error: demandeError } = await supabase
      .from('demandes')
      .select('id, pro_id, statut')
      .eq('id', demandeId)
      .eq('pro_id', proProfile.id)
      .single();

    if (demandeError || !demande) {
      return NextResponse.json({ error: "Demande non trouvée ou accès refusé" }, { status: 404 });
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      statut: statut,
      updated_at: new Date().toISOString()
    };

    // Si c'est une replanification, mettre à jour la date
    if (nouvelleDate && statut === 'REPLANIFIEE') {
      updateData.date = new Date(nouvelleDate).toISOString();
    }

    // Mettre à jour la demande
    const { data: updatedDemande, error: updateError } = await supabase
      .from('demandes')
      .update(updateData)
      .eq('id', demandeId)
      .select(`
        *,
        equide:equides(*),
        proprio:proprio_profiles(*),
        pro:pro_profiles(*)
      `)
      .single();

    if (updateError) {
      console.error("Erreur lors de la mise à jour de la demande:", updateError);
      return NextResponse.json({ error: "Erreur lors de la mise à jour de la demande" }, { status: 500 });
    }

    // Si la demande est acceptée, créer un rendez-vous
    if (statut === 'ACCEPTEE') {
      // Récupérer les données de la demande pour créer le rendez-vous
      const { data: demandeComplete, error: demandeCompleteError } = await supabase
        .from('demandes')
        .select(`
          *,
          equide:equides(*),
          proprio:proprio_profiles(*)
        `)
        .eq('id', demandeId)
        .single();

      if (!demandeCompleteError && demandeComplete) {
        // Créer un client temporaire pour le rendez-vous
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .insert({
            pro_id: proProfile.id,
            nom: demandeComplete.proprio.nom,
            prenom: demandeComplete.proprio.prenom,
            email: demandeComplete.proprio.email,
            telephone: demandeComplete.proprio.telephone,
            adresse: demandeComplete.adresse,
            ville: demandeComplete.proprio.ville || 'Ville inconnue',
            codePostal: demandeComplete.proprio.codePostal || '00000',
            statut: 'actif'
          })
          .select('id')
          .single();

        if (!clientError && client) {
          // Créer le rendez-vous
          const { error: rdvError } = await supabase
            .from('rendez_vous')
            .insert({
              demande_id: demandeId,
              pro_id: proProfile.id,
              client_id: client.id,
              date: demandeComplete.date,
              statut: 'CONFIRME',
              notes: notes || `Rendez-vous confirmé pour ${demandeComplete.equide.nom}`
            });

          if (rdvError) {
            console.error("Erreur lors de la création du rendez-vous:", rdvError);
          } else {
            console.log("✅ Rendez-vous créé avec succès");
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      demande: updatedDemande,
      message: `Demande ${statut.toLowerCase()} avec succès` 
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}