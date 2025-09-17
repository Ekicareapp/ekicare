import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "PROFESSIONNEL") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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

    // Vérifier si les tables existent
    const { data: testDemandes, error: testError } = await supabase
      .from('demandes')
      .select('id')
      .limit(1);

    if (testError && testError.code === 'PGRST205') {
      // Tables n'existent pas encore - retourner des données simulées
      const demandesSimulees = [
        {
          id: `demande_${Date.now()}_1`,
          proprio_id: "proprio_1",
          pro_id: proProfile.id,
          equide_id: "equide_1",
          type: "consultation",
          statut: "EN_ATTENTE",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
          adresse: "123 Rue de la Paix, 75001 Paris",
          description: "Consultation de routine pour mon cheval",
          creneaux_alternatifs: [],
          created_at: new Date().toISOString(),
          // Données du propriétaire (simulées)
          proprio: {
            nom: "Dupont",
            prenom: "Marie",
            telephone: "0123456789"
          },
          equide: {
            nom: "Bella",
            race: "Pur-sang",
            age: 8
          }
        }
      ];

      return NextResponse.json({ 
        demandes: demandesSimulees,
        message: "Mode simulation - Tables manquantes" 
      });
    }

    // Tables existent - récupérer les vraies demandes
    const { data: demandes, error: demandesError } = await supabase
      .from('demandes')
      .select(`
        *,
        proprio:proprio_profiles(nom, prenom, telephone),
        equide:equides(nom, race, age)
      `)
      .eq('pro_id', proProfile.id)
      .order('created_at', { ascending: false });

    if (demandesError) {
      console.error("Erreur lors de la récupération des demandes:", demandesError);
      return NextResponse.json({ error: "Erreur lors de la récupération des demandes" }, { status: 500 });
    }

    return NextResponse.json({ demandes: demandes || [] });

  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

