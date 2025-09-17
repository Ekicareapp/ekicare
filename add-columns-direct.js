require('dotenv').config({ path: '.env.local' });

async function addColumnsDirect() {
    console.log('🔧 Ajout des colonnes via API REST Supabase...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
        process.exit(1);
    }

    try {
        // Utiliser l'API REST de Supabase pour exécuter du SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'apikey': supabaseAnonKey
            },
            body: JSON.stringify({
                sql: `
                    ALTER TABLE pro_profiles 
                    ADD COLUMN IF NOT EXISTS duree_consultation INTEGER DEFAULT 60;
                    
                    ALTER TABLE pro_profiles 
                    ADD COLUMN IF NOT EXISTS disponibilites JSONB DEFAULT '{
                        "lundi": {"matin": true, "apresMidi": true, "soir": false},
                        "mardi": {"matin": true, "apresMidi": true, "soir": false},
                        "mercredi": {"matin": true, "apresMidi": true, "soir": false},
                        "jeudi": {"matin": true, "apresMidi": true, "soir": false},
                        "vendredi": {"matin": true, "apresMidi": true, "soir": false},
                        "samedi": {"matin": true, "apresMidi": false, "soir": false},
                        "dimanche": {"matin": false, "apresMidi": false, "soir": false}
                    }'::jsonb;
                `
            })
        });

        if (response.ok) {
            console.log('✅ Colonnes ajoutées avec succès via API REST !');
        } else {
            const error = await response.text();
            console.log('⚠️ Erreur API REST:', error);
            throw new Error('API REST failed');
        }

    } catch (error) {
        console.log('❌ Impossible d\'ajouter les colonnes via API:', error.message);
        console.log('\n📋 Instructions manuelles:');
        console.log('1. Allez dans l\'interface Supabase');
        console.log('2. Ouvrez l\'onglet "SQL Editor"');
        console.log('3. Exécutez ces requêtes SQL une par une:');
        console.log('\n--- Requête 1 ---');
        console.log('ALTER TABLE pro_profiles ADD COLUMN IF NOT EXISTS duree_consultation INTEGER DEFAULT 60;');
        console.log('\n--- Requête 2 ---');
        console.log(`ALTER TABLE pro_profiles ADD COLUMN IF NOT EXISTS disponibilites JSONB DEFAULT '{
  "lundi": {"matin": true, "apresMidi": true, "soir": false},
  "mardi": {"matin": true, "apresMidi": true, "soir": false},
  "mercredi": {"matin": true, "apresMidi": true, "soir": false},
  "jeudi": {"matin": true, "apresMidi": true, "soir": false},
  "vendredi": {"matin": true, "apresMidi": true, "soir": false},
  "samedi": {"matin": true, "apresMidi": false, "soir": false},
  "dimanche": {"matin": false, "apresMidi": false, "soir": false}
}'::jsonb;`);
        console.log('\n4. Cliquez sur "Run" pour chaque requête');
        console.log('5. Relancez le test avec: node test-complete-functionality.js');
    }
}

addColumnsDirect();

