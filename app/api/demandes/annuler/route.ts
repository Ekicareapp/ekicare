import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

// PUT /api/demandes/annuler - Annuler une demande (propriétaire)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { demandeId } = body;

    // Validation des données
    if (!demandeId) {
      return NextResponse.json({ error: "ID de demande requis" }, { status: 400 });
    }

    // Vérifier que l'utilisateur est un propriétaire
    if (session.user.role !== "PROPRIETAIRE") {
      return NextResponse.json({ error: "Accès refusé - Seuls les propriétaires peuvent annuler leurs demandes" }, { status: 403 });
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

    // Vérifier que la demande appartient à ce propriétaire
    const { data: demande, error: demandeError } = await supabase
      .from('demandes')
      .select('id, proprio_id, statut')
      .eq('id', demandeId)
      .eq('proprio_id', proprioProfile.id)
      .single();

    if (demandeError || !demande) {
      return NextResponse.json({ error: "Demande non trouvée ou accès refusé" }, { status: 404 });
    }

    // Vérifier que la demande peut être annulée
    if (demande.statut === 'ANNULEE') {
      return NextResponse.json({ error: "Cette demande est déjà annulée" }, { status: 400 });
    }

    if (demande.statut === 'ACCEPTEE') {
      return NextResponse.json({ error: "Cette demande a déjà été acceptée et ne peut plus être annulée" }, { status: 400 });
    }

    // Mettre à jour le statut de la demande
    const { data: updatedDemande, error: updateError } = await supabase
      .from('demandes')
      .update({
        statut: 'ANNULEE',
        updated_at: new Date().toISOString()
      })
      .eq('id', demandeId)
      .select(`
        *,
        equide:equides(*),
        proprio:proprio_profiles(*),
        pro:pro_profiles(*)
      `)
      .single();

    if (updateError) {
      console.error("Erreur lors de l'annulation de la demande:", updateError);
      return NextResponse.json({ error: "Erreur lors de l'annulation de la demande" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      demande: updatedDemande,
      message: "Demande annulée avec succès" 
    });

  } catch (error) {
    console.error("Erreur lors de l'annulation de la demande:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
