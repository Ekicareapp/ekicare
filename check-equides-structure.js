require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEquidesStructure() {
    console.log('🔍 Vérification de la structure de la table equides...');
    
    try {
        // Essayer de récupérer la structure de la table
        const { data, error } = await supabase
            .from('equides')
            .select('*')
            .limit(1);

        if (error) {
            console.log('❌ Erreur lors de la récupération:', error.message);
            console.log('📋 Détails:', error);
            
            // Essayer de récupérer toutes les tables pour voir la structure
            console.log('\n🔍 Tentative de récupération des tables disponibles...');
            const { data: tables, error: tablesError } = await supabase
                .from('information_schema.tables')
                .select('table_name')
                .eq('table_schema', 'public');
                
            if (tablesError) {
                console.log('❌ Impossible de récupérer les tables:', tablesError.message);
            } else {
                console.log('📊 Tables disponibles:', tables?.map(t => t.table_name));
            }
        } else {
            console.log('✅ Structure de la table equides:');
            console.log('📊 Colonnes:', Object.keys(data[0] || {}));
            console.log('📋 Données d\'exemple:', data[0]);
        }

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
    }
}

checkEquidesStructure();

