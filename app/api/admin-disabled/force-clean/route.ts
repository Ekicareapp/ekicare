import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    console.log('🔥 NETTOYAGE FORCÉ - Suppression de TOUT...');

    // 1. Supprimer TOUS les rendez-vous
    console.log('📅 Suppression de TOUS les rendez-vous...');
    const { error: rdvError } = await supabase
      .from('rendez_vous')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (rdvError) {
      console.error('❌ Erreur rendez-vous:', rdvError);
    } else {
      console.log('✅ TOUS les rendez-vous supprimés');
    }

    // 2. Supprimer TOUTES les demandes
    console.log('📋 Suppression de TOUTES les demandes...');
    const { error: demandesError } = await supabase
      .from('demandes')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (demandesError) {
      console.error('❌ Erreur demandes:', demandesError);
    } else {
      console.log('✅ TOUTES les demandes supprimées');
    }

    // 3. Supprimer TOUS les clients
    console.log('👥 Suppression de TOUS les clients...');
    const { error: clientsError } = await supabase
      .from('clients')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (clientsError) {
      console.error('❌ Erreur clients:', clientsError);
    } else {
      console.log('✅ TOUS les clients supprimés');
    }

    // 4. Supprimer TOUTES les tournées
    console.log('🚗 Suppression de TOUTES les tournées...');
    const { error: tourneesError } = await supabase
      .from('tournees')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (tourneesError) {
      console.error('❌ Erreur tournées:', tourneesError);
    } else {
      console.log('✅ TOUTES les tournées supprimées');
    }

    console.log('🎉 NETTOYAGE FORCÉ TERMINÉ !');

    return NextResponse.json({ 
      success: true, 
      message: "NETTOYAGE FORCÉ TERMINÉ - Plus aucun rendez-vous 'Sophie Martin' !" 
    });

  } catch (error) {
    console.error("Erreur lors du nettoyage forcé:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

