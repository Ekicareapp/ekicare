// Script pour créer les politiques RLS pour la table demandes
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createRLSPolicies() {
  try {
    console.log('🔄 Création des politiques RLS pour la table demandes...');

    // Politique pour permettre aux propriétaires de voir leurs demandes
    const { error: selectPolicyError } = await supabase.rpc('exec', {
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
    });

    if (selectPolicyError) {
      console.log('⚠️ Erreur politique SELECT:', selectPolicyError);
    } else {
      console.log('✅ Politique SELECT créée');
    }

    // Politique pour permettre aux propriétaires d'insérer leurs demandes
    const { error: insertPolicyError } = await supabase.rpc('exec', {
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
    });

    if (insertPolicyError) {
      console.log('⚠️ Erreur politique INSERT:', insertPolicyError);
    } else {
      console.log('✅ Politique INSERT créée');
    }

    // Politique pour permettre aux propriétaires de modifier leurs demandes
    const { error: updatePolicyError } = await supabase.rpc('exec', {
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
    });

    if (updatePolicyError) {
      console.log('⚠️ Erreur politique UPDATE:', updatePolicyError);
    } else {
      console.log('✅ Politique UPDATE créée');
    }

    // Politique pour permettre aux professionnels de voir les demandes qui leur sont adressées
    const { error: proSelectPolicyError } = await supabase.rpc('exec', {
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
    });

    if (proSelectPolicyError) {
      console.log('⚠️ Erreur politique SELECT pro:', proSelectPolicyError);
    } else {
      console.log('✅ Politique SELECT pro créée');
    }

    console.log('✅ Politiques RLS créées avec succès !');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

createRLSPolicies();
