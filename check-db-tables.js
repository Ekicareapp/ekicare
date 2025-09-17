require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDbTables() {
    console.log('🔍 Vérification des tables de la base de données...');
    
    try {
        // Liste des tables à vérifier
        const tablesToCheck = [
            'users',
            'proprio_profiles', 
            'pro_profiles',
            'equides',
            'demandes',
            'rendez_vous',
            'clients'
        ];

        for (const tableName of tablesToCheck) {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1);

                if (error) {
                    console.log(`❌ Table '${tableName}': ${error.message}`);
                } else {
                    console.log(`✅ Table '${tableName}': OK`);
                }
            } catch (err) {
                console.log(`❌ Table '${tableName}': Erreur - ${err.message}`);
            }
        }

        console.log('\n📋 Résumé:');
        console.log('- Les tables manquantes doivent être créées dans Supabase');
        console.log('- Pour l\'instant, le système de réservation fonctionne avec les équidés');
        console.log('- Les demandes et rendez-vous peuvent être ajoutés plus tard');

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
    }
}

checkDbTables();

