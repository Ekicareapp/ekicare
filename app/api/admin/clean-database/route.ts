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

    // Vérifier que l'utilisateur est un professionnel
    if (session.user.role !== 'PROFESSIONNEL') {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    console.log('🧹 Nettoyage de la base de données Supabase...');

    // 1. Supprimer tous les rendez-vous
    console.log('📅 Suppression des rendez-vous...');
    const { error: rdvError } = await supabase
      .from('rendez_vous')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (rdvError) {
      console.error('❌ Erreur lors de la suppression des rendez-vous:', rdvError);
    } else {
      console.log('✅ Rendez-vous supprimés');
    }

    // 2. Supprimer toutes les demandes
    console.log('📋 Suppression des demandes...');
    const { error: demandesError } = await supabase
      .from('demandes')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (demandesError) {
      console.error('❌ Erreur lors de la suppression des demandes:', demandesError);
    } else {
      console.log('✅ Demandes supprimées');
    }

    // 3. Supprimer tous les clients
    console.log('👥 Suppression des clients...');
    const { error: clientsError } = await supabase
      .from('clients')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (clientsError) {
      console.error('❌ Erreur lors de la suppression des clients:', clientsError);
    } else {
      console.log('✅ Clients supprimés');
    }

    // 4. Supprimer toutes les tournées
    console.log('🚗 Suppression des tournées...');
    const { error: tourneesError } = await supabase
      .from('tournees')
      .delete()
      .neq('id', 'dummy'); // Supprime tout

    if (tourneesError) {
      console.error('❌ Erreur lors de la suppression des tournées:', tourneesError);
    } else {
      console.log('✅ Tournées supprimées');
    }

    return NextResponse.json({ 
      success: true, 
      message: "Base de données nettoyée avec succès !" 
    });

  } catch (error) {
    console.error("Erreur lors du nettoyage de la base de données:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

