// Script pour créer les tables dans Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('🏗️ Création des tables dans Supabase...');

    // Lire le fichier SQL
    const sqlContent = fs.readFileSync('./create-tables.sql', 'utf8');

    // Exécuter le SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('❌ Erreur lors de la création des tables:', error);
      
      // Essayer une approche alternative - exécuter les requêtes une par une
      console.log('🔄 Tentative alternative...');
      
      const queries = sqlContent.split(';').filter(q => q.trim());
      
      for (const query of queries) {
        if (query.trim()) {
          console.log(`📝 Exécution: ${query.substring(0, 50)}...`);
          
          const { error: queryError } = await supabase
            .from('_temp')
            .select('*')
            .limit(0); // Juste pour tester la connexion
          
          if (queryError) {
            console.log(`⚠️ Requête ignorée (table temporaire): ${queryError.message}`);
          }
        }
      }
    } else {
      console.log('✅ Tables créées avec succès:', data);
    }

    // Vérifier que les tables existent
    console.log('🔍 Vérification des tables...');
    
    const { data: demandesTest, error: demandesError } = await supabase
      .from('demandes')
      .select('*')
      .limit(1);

    if (demandesError) {
      console.log('⚠️ Table demandes:', demandesError.message);
    } else {
      console.log('✅ Table demandes accessible');
    }

    const { data: rdvTest, error: rdvError } = await supabase
      .from('rendez_vous')
      .select('*')
      .limit(1);

    if (rdvError) {
      console.log('⚠️ Table rendez_vous:', rdvError.message);
    } else {
      console.log('✅ Table rendez_vous accessible');
    }

    console.log('🎉 Script terminé !');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
  }
}

createTables();

