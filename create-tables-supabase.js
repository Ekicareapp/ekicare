const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Création des tables dans Supabase...');

  try {
    // 1. Créer la table demandes
    console.log('📋 Création de la table demandes...');
    const { error: demandesError } = await supabase.rpc('exec_sql', {
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
      console.log('⚠️ Erreur création table demandes:', demandesError.message);
    } else {
      console.log('✅ Table demandes créée');
    }

    // 2. Créer la table rendez_vous
    console.log('📋 Création de la table rendez_vous...');
    const { error: rdvError } = await supabase.rpc('exec_sql', {
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
      console.log('⚠️ Erreur création table rendez_vous:', rdvError.message);
    } else {
      console.log('✅ Table rendez_vous créée');
    }

    // 3. Créer la table clients
    console.log('📋 Création de la table clients...');
    const { error: clientsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          pro_id TEXT NOT NULL,
          nom TEXT NOT NULL,
          prenom TEXT NOT NULL,
          email TEXT NOT NULL,
          telephone TEXT NOT NULL,
          adresse TEXT NOT NULL,
          ville TEXT NOT NULL,
          code_postal TEXT NOT NULL,
          date_inscription TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          nombre_equides INTEGER DEFAULT 0,
          dernier_rendez_vous TIMESTAMP WITH TIME ZONE,
          total_rendez_vous INTEGER DEFAULT 0,
          statut TEXT DEFAULT 'actif',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (clientsError) {
      console.log('⚠️ Erreur création table clients:', clientsError.message);
    } else {
      console.log('✅ Table clients créée');
    }

    // 4. Créer la table tournees
    console.log('📋 Création de la table tournees...');
    const { error: tourneesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS tournees (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          pro_id TEXT NOT NULL,
          rendez_vous_id TEXT NOT NULL,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          statut TEXT NOT NULL DEFAULT 'PLANIFIEE',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (tourneesError) {
      console.log('⚠️ Erreur création table tournees:', tourneesError.message);
    } else {
      console.log('✅ Table tournees créée');
    }

    // 5. Créer la table disponibilites
    console.log('📋 Création de la table disponibilites...');
    const { error: dispoError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS disponibilites (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          pro_id TEXT NOT NULL,
          jour TEXT NOT NULL,
          matin BOOLEAN DEFAULT false,
          apres_midi BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(pro_id, jour)
        );
      `
    });

    if (dispoError) {
      console.log('⚠️ Erreur création table disponibilites:', dispoError.message);
    } else {
      console.log('✅ Table disponibilites créée');
    }

    // 6. Créer la table certifications
    console.log('📋 Création de la table certifications...');
    const { error: certError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS certifications (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          pro_id TEXT NOT NULL,
          nom TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (certError) {
      console.log('⚠️ Erreur création table certifications:', certError.message);
    } else {
      console.log('✅ Table certifications créée');
    }

    console.log('🎉 Création des tables terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
  }
}

createTables();