import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Création des politiques RLS pour la table demandes...');

    // Désactiver temporairement RLS pour créer les politiques
    const { error: disableRLSError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE demandes DISABLE ROW LEVEL SECURITY;'
    });

    if (disableRLSError) {
      console.log('⚠️ Erreur désactivation RLS:', disableRLSError);
    }

    // Créer les politiques RLS
    const policies = [
      {
        name: "Propriétaires peuvent voir leurs demandes",
        sql: `
          CREATE POLICY IF NOT EXISTS "Propriétaires peuvent voir leurs demandes" ON demandes
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM proprio_profiles 
              WHERE proprio_profiles.id = demandes.proprio_id 
              AND proprio_profiles.user_id = auth.uid()
            )
          );
        `
      },
      {
        name: "Propriétaires peuvent insérer leurs demandes",
        sql: `
          CREATE POLICY IF NOT EXISTS "Propriétaires peuvent insérer leurs demandes" ON demandes
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM proprio_profiles 
              WHERE proprio_profiles.id = demandes.proprio_id 
              AND proprio_profiles.user_id = auth.uid()
            )
          );
        `
      },
      {
        name: "Propriétaires peuvent modifier leurs demandes",
        sql: `
          CREATE POLICY IF NOT EXISTS "Propriétaires peuvent modifier leurs demandes" ON demandes
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM proprio_profiles 
              WHERE proprio_profiles.id = demandes.proprio_id 
              AND proprio_profiles.user_id = auth.uid()
            )
          );
        `
      },
      {
        name: "Professionnels peuvent voir leurs demandes",
        sql: `
          CREATE POLICY IF NOT EXISTS "Professionnels peuvent voir leurs demandes" ON demandes
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM pro_profiles 
              WHERE pro_profiles.id = demandes.pro_id 
              AND pro_profiles.user_id = auth.uid()
            )
          );
        `
      }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec', { sql: policy.sql });
      
      if (error) {
        console.log(`⚠️ Erreur politique ${policy.name}:`, error);
        errorCount++;
      } else {
        console.log(`✅ Politique ${policy.name} créée`);
        successCount++;
      }
    }

    // Réactiver RLS
    const { error: enableRLSError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;'
    });

    if (enableRLSError) {
      console.log('⚠️ Erreur réactivation RLS:', enableRLSError);
    } else {
      console.log('✅ RLS réactivé');
    }

    // Tester l'insertion d'une demande de test
    const { data: testData, error: testError } = await supabase
      .from('demandes')
      .select('*')
      .limit(1);

    if (testError) {
      console.log('⚠️ Test d\'accès échoué:', testError.message);
    } else {
      console.log('✅ Test d\'accès réussi');
    }

    return NextResponse.json({ 
      success: true, 
      message: `Politiques RLS créées: ${successCount} succès, ${errorCount} erreurs`,
      successCount,
      errorCount
    });

  } catch (error) {
    console.error("Erreur lors de la création des politiques RLS:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
