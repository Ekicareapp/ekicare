import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "PROPRIETAIRE") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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
          proprio_id: proprioProfile.id,
          pro_id: "pro_1",
          equide_id: "equide_1",
          type: "consultation",
          statut: "EN_ATTENTE",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
          adresse: "123 Rue de la Paix, 75001 Paris",
          description: "Consultation de routine pour mon cheval",
          creneaux_alternatifs: [],
          created_at: new Date().toISOString(),
          // Données du professionnel (simulées)
          pro: {
            nom: "Martin",
            prenom: "Dr. Jean",
            profession: "Vétérinaire",
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
        pro:pro_profiles(nom, prenom, profession, telephone),
        equide:equides(nom, race, age)
      `)
      .eq('proprio_id', proprioProfile.id)
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

