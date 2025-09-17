const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDemandesTable() {
  try {
    console.log('🔄 Création de la table demandes...');

    // Créer la table demandes
    const { error: createError } = await supabase.rpc('exec_sql', {
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
      `
    });

    if (createError) {
      console.error('❌ Erreur lors de la création de la table:', createError);
      return;
    }

    // Créer l'index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_demandes_proprio_id ON demandes(proprio_id);
        CREATE INDEX IF NOT EXISTS idx_demandes_pro_id ON demandes(pro_id);
        CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes(statut);
      `
    });

    if (indexError) {
      console.error('❌ Erreur lors de la création des index:', indexError);
      return;
    }

    // Activer RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;'
    });

    if (rlsError) {
      console.error('❌ Erreur lors de l\'activation de RLS:', rlsError);
      return;
    }

    console.log('✅ Table demandes créée avec succès !');

    // Vérifier que la table existe
    const { data: tables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'demandes');

    if (checkError) {
      console.error('❌ Erreur lors de la vérification:', checkError);
      return;
    }

    if (tables && tables.length > 0) {
      console.log('✅ Table demandes confirmée dans la base de données');
    } else {
      console.log('❌ Table demandes non trouvée après création');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

createDemandesTable();
