import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Création de la table demandes...');

    // Tester d'abord si la table existe
    const { data: testData, error: testError } = await supabase
      .from('demandes')
      .select('*')
      .limit(1);

    if (!testError) {
      console.log('✅ Table demandes existe déjà');
      return NextResponse.json({ 
        success: true, 
        message: "Table demandes existe déjà" 
      });
    }

    // Si la table n'existe pas, on ne peut pas la créer via l'API
    // Il faut l'ajouter manuellement dans Supabase
    console.log('❌ Table demandes n\'existe pas. Création manuelle requise.');
    return NextResponse.json({ 
      success: false, 
      error: "Table demandes n'existe pas. Veuillez l'ajouter manuellement dans Supabase.",
      sql: `
CREATE TABLE IF NOT EXISTS demandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proprio_id UUID NOT NULL,
  equide_id UUID NOT NULL,
  pro_id UUID,
  type TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'EN_ATTENTE',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  adresse TEXT NOT NULL,
  telephone TEXT,
  description TEXT NOT NULL,
  creneaux_alternatifs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (proprio_id) REFERENCES proprio_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (equide_id) REFERENCES equides(id) ON DELETE CASCADE,
  FOREIGN KEY (pro_id) REFERENCES pro_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_demandes_proprio_id ON demandes(proprio_id);
CREATE INDEX IF NOT EXISTS idx_demandes_pro_id ON demandes(pro_id);
CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes(statut);
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
      `
    });


  } catch (error) {
    console.error("Erreur lors de la création de la table:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
