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

    console.log('🏗️ Création des tables dans Supabase...');

    // 1. Créer la table demandes
    console.log('📋 Création de la table demandes...');
    const { error: demandesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS demandes (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          proprio_id TEXT NOT NULL,
          equide_id TEXT NOT NULL,
          pro_id TEXT,
          type TEXT NOT NULL,
          statut TEXT NOT NULL DEFAULT 'EN_ATTENTE',
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          adresse TEXT NOT NULL,
          description TEXT NOT NULL,
          creneaux_alternatifs JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (demandesError) {
      console.log('⚠️ Erreur table demandes:', demandesError);
    } else {
      console.log('✅ Table demandes créée');
    }

    // 2. Créer la table rendez_vous
    console.log('📅 Création de la table rendez_vous...');
    const { error: rdvError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS rendez_vous (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          demande_id TEXT UNIQUE NOT NULL,
          pro_id TEXT NOT NULL,
          client_id TEXT NOT NULL,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          statut TEXT NOT NULL DEFAULT 'CONFIRME',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (rdvError) {
      console.log('⚠️ Erreur table rendez_vous:', rdvError);
    } else {
      console.log('✅ Table rendez_vous créée');
    }

    // 3. Créer les index
    console.log('🔍 Création des index...');
    const { error: indexError } = await supabase.rpc('exec', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_demandes_proprio_id ON demandes(proprio_id);
        CREATE INDEX IF NOT EXISTS idx_demandes_pro_id ON demandes(pro_id);
        CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes(statut);
        CREATE INDEX IF NOT EXISTS idx_rendez_vous_pro_id ON rendez_vous(pro_id);
        CREATE INDEX IF NOT EXISTS idx_rendez_vous_client_id ON rendez_vous(client_id);
        CREATE INDEX IF NOT EXISTS idx_rendez_vous_statut ON rendez_vous(statut);
      `
    });

    if (indexError) {
      console.log('⚠️ Erreur index:', indexError);
    } else {
      console.log('✅ Index créés');
    }

    // 4. Vérifier que les tables existent
    console.log('🔍 Vérification des tables...');
    
    const { data: demandesTest, error: demandesTestError } = await supabase
      .from('demandes')
      .select('*')
      .limit(1);

    if (demandesTestError) {
      console.log('⚠️ Table demandes non accessible:', demandesTestError.message);
    } else {
      console.log('✅ Table demandes accessible');
    }

    const { data: rdvTest, error: rdvTestError } = await supabase
      .from('rendez_vous')
      .select('*')
      .limit(1);

    if (rdvTestError) {
      console.log('⚠️ Table rendez_vous non accessible:', rdvTestError.message);
    } else {
      console.log('✅ Table rendez_vous accessible');
    }

    return NextResponse.json({ 
      success: true, 
      message: "Tables créées avec succès !",
      demandes: demandesTestError ? 'Erreur' : 'OK',
      rendez_vous: rdvTestError ? 'Erreur' : 'OK'
    });

  } catch (error) {
    console.error("Erreur lors de la création des tables:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

