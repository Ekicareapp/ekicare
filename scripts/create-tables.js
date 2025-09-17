const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'Présent' : 'Manquant');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Création des tables dans Supabase...');
  console.log('URL Supabase:', supabaseUrl);

  try {
    // Test de connexion
    console.log('🔍 Test de connexion...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (testError) {
      console.log('⚠️ Erreur de connexion:', testError.message);
    } else {
      console.log('✅ Connexion réussie');
    }

    // Vérifier si les tables existent déjà
    console.log('🔍 Vérification des tables existantes...');
    
    const tables = ['demandes', 'rendez_vous', 'clients', 'tournees', 'disponibilites', 'certifications'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error && error.code === 'PGRST205') {
        console.log(`❌ Table ${table} n'existe pas`);
      } else if (error) {
        console.log(`⚠️ Erreur vérification table ${table}:`, error.message);
      } else {
        console.log(`✅ Table ${table} existe déjà`);
      }
    }

    console.log('🎉 Vérification terminée !');
    console.log('💡 Pour créer les tables, utilisez l\'interface Supabase ou exécutez les requêtes SQL suivantes :');
    console.log(`
-- Table demandes
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

-- Table rendez_vous
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

-- Table clients
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

-- Table tournees
CREATE TABLE IF NOT EXISTS tournees (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  pro_id TEXT NOT NULL,
  rendez_vous_id TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  statut TEXT NOT NULL DEFAULT 'PLANIFIEE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table disponibilites
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

-- Table certifications
CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  pro_id TEXT NOT NULL,
  nom TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

createTables();

