import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Désactivation temporaire de RLS pour la table demandes...');

    // Tester d'abord si on peut accéder à la table
    const { data: testData, error: testError } = await supabase
      .from('demandes')
      .select('*')
      .limit(1);

    if (testError) {
      console.log('❌ Erreur d\'accès à la table demandes:', testError.message);
      return NextResponse.json({ 
        success: false, 
        error: `Erreur d'accès à la table: ${testError.message}`,
        code: testError.code
      });
    }

    console.log('✅ Table demandes accessible');
    return NextResponse.json({ 
      success: true, 
      message: "Table demandes accessible - RLS peut être géré manuellement",
      testData: testData?.length || 0
    });

  } catch (error) {
    console.error("Erreur lors du test d'accès:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
